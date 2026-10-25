import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uMorphProgress;
  uniform vec2 uMouse;
  uniform float uMouseRadius;
  uniform float uPixelRatio;
  uniform float uAspect;

  attribute vec3 aTargetPosition;
  attribute vec3 aTargetNormal;
  attribute float aRandom;

  varying float vNoise;
  varying float vInfluence;
  varying float vRandom;

  // =========================================================
  // Classic 3D Simplex Noise (Ashima Arts / Stefan Gustavson)
  // =========================================================
  vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
  }
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0);
    vec4 p = permute(
      permute(
        permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0)
      )
      + i.x + vec4(0.0, i1.x, i2.x, 1.0)
    );

    // Gradients
    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    // Smooth cubic curve for morph transition
    float t = smoothstep(0.0, 1.0, uMorphProgress);

    // 1. Morphological interpolation between Sphere and TorusKnot
    vec3 morphedPos = mix(position, aTargetPosition, t);
    vec3 morphedNorm = normalize(mix(normal, aTargetNormal, t));

    // 2. Organic 3D Simplex Noise displacement along vertex normal
    float primaryWave = snoise(morphedPos * 0.58 + vec3(uTime * 0.24));
    float secondaryWave = snoise(morphedPos * 1.35 - vec3(uTime * 0.38)) * 0.35;
    float combinedNoise = primaryWave + secondaryWave;

    vec3 displacedPos = morphedPos + morphedNorm * (combinedNoise * 0.32);

    // 3. Project to view & clip space to evaluate cursor proximity
    vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);
    vec4 projected = projectionMatrix * mvPosition;
    vec2 ndcPos = projected.xy / max(projected.w, 0.0001);

    // Aspect-corrected distance to normalized cursor uMouse (-1 to 1)
    vec2 cursorDelta = ndcPos - uMouse;
    cursorDelta.x *= uAspect;
    float distToCursor = length(cursorDelta);

    // Smooth repulsion field when cursor is within uMouseRadius
    float influence = smoothstep(uMouseRadius, 0.0, distToCursor);
    influence = pow(influence, 1.45);

    vec2 repelDir = distToCursor > 0.0001 ? normalize(ndcPos - uMouse) : vec2(0.0, 1.0);
    mvPosition.xy += repelDir * (influence * 0.72);
    mvPosition.z += influence * 0.42 * sin(distToCursor * 10.0 - uTime * 3.5);

    gl_Position = projectionMatrix * mvPosition;

    // 4. Perspective-attenuated point size
    float baseSize = 16.0 + aRandom * 14.0 + influence * 14.0;
    gl_PointSize = baseSize * uPixelRatio * (1.0 / -mvPosition.z);

    vNoise = combinedNoise;
    vInfluence = influence;
    vRandom = aRandom;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying float vNoise;
  varying float vInfluence;
  varying float vRandom;

  void main() {
    // Soft radial glow attenuation (no square edges)
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float radialFalloff = 1.0 - (dist * 2.0);
    float glow = pow(radialFalloff, 2.2);

    // Refined, non-generic palette: Slate Steel -> Platinum Silver -> Soft Iris Quartz
    vec3 colorDeep = vec3(0.42, 0.47, 0.64);     // Cool Muted Slate
    vec3 colorMid = vec3(0.76, 0.79, 0.90);      // Soft Silver-Blue
    vec3 colorHighlight = vec3(0.95, 0.93, 0.98);// Warm Platinum Pearl
    vec3 colorCursor = vec3(0.78, 0.72, 0.96);   // Subtle Iris Quartz on interaction

    float noiseFactor = smoothstep(-0.7, 0.85, vNoise);
    vec3 baseColor = mix(colorDeep, colorMid, noiseFactor);
    baseColor = mix(baseColor, colorHighlight, pow(noiseFactor, 2.4));

    // Highlight particles disturbed by the cursor
    vec3 finalColor = mix(baseColor, colorCursor, vInfluence * 0.85);

    float alpha = glow * (0.55 + 0.3 * vRandom + 0.25 * vInfluence);
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export default function DefenseRadarScene({ morphTarget = 0 }) {
  const mountRef = useRef(null);
  const targetMorphRef = useRef(0);

  useEffect(() => {
    targetMorphRef.current = morphTarget;
  }, [morphTarget]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    container.appendChild(renderer.domElement);

    // =========================================================
    // BUILD TWO BASE GEOMETRIES WITH IDENTICAL VERTEX COUNT
    // (124 + 1) * (100 + 1) = 12,625 particles
    // =========================================================
    const segU = 124;
    const segV = 100;

    const sphereGeo = new THREE.SphereGeometry(2.35, segU, segV);
    const torusKnotGeo = new THREE.TorusKnotGeometry(1.65, 0.48, segU, segV, 2, 3);

    const spherePos = sphereGeo.attributes.position.array;
    const sphereNorm = sphereGeo.attributes.normal.array;
    const knotPos = torusKnotGeo.attributes.position.array;
    const knotNorm = torusKnotGeo.attributes.normal.array;

    const particleCount = sphereGeo.attributes.position.count; // 12,625

    const positions = new Float32Array(particleCount * 3);
    const normals = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const targetNormals = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount);

    // Add slight organic tangent jitter so points don't look like rigid grid lines
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const jitterX = (Math.random() - 0.5) * 0.045;
      const jitterY = (Math.random() - 0.5) * 0.045;
      const jitterZ = (Math.random() - 0.5) * 0.045;

      positions[i3] = spherePos[i3] + jitterX;
      positions[i3 + 1] = spherePos[i3 + 1] + jitterY;
      positions[i3 + 2] = spherePos[i3 + 2] + jitterZ;

      normals[i3] = sphereNorm[i3];
      normals[i3 + 1] = sphereNorm[i3 + 1];
      normals[i3 + 2] = sphereNorm[i3 + 2];

      targetPositions[i3] = knotPos[i3] + jitterX;
      targetPositions[i3 + 1] = knotPos[i3 + 1] + jitterY;
      targetPositions[i3 + 2] = knotPos[i3 + 2] + jitterZ;

      targetNormals[i3] = knotNorm[i3];
      targetNormals[i3 + 1] = knotNorm[i3 + 1];
      targetNormals[i3 + 2] = knotNorm[i3 + 2];

      randoms[i] = Math.random();
    }

    sphereGeo.dispose();
    torusKnotGeo.dispose();

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    particlesGeometry.setAttribute(
      'aTargetPosition',
      new THREE.BufferAttribute(targetPositions, 3)
    );
    particlesGeometry.setAttribute('aTargetNormal', new THREE.BufferAttribute(targetNormals, 3));
    particlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    const uniforms = {
      uTime: { value: 0 },
      uMorphProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uMouseRadius: { value: 0.42 },
      uPixelRatio: { value: pixelRatio },
      uAspect: { value: width / height },
    };

    const particlesMaterial = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // =========================================================
    // POINTER & SCROLL TRACKING
    // =========================================================
    const targetMouse = new THREE.Vector2(0, 0);
    const currentMouse = new THREE.Vector2(0, 0);
    let pointerActive = false;
    let scrollY = window.scrollY;

    const handlePointerMove = (event) => {
      pointerActive = true;
      targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // =========================================================
    // ANIMATION LOOP
    // =========================================================
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      uniforms.uTime.value = elapsedTime;

      // Smoothly interpolate uMorphProgress (0 <-> 1)
      uniforms.uMorphProgress.value +=
        (targetMorphRef.current - uniforms.uMorphProgress.value) * 0.045;

      // Smoothly interpolate cursor coordinates (lerp)
      if (pointerActive) {
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;
        uniforms.uMouse.value.copy(currentMouse);
      }

      // Gentle orbital rotation + subtle scroll & cursor tilt
      const scrollOffset = scrollY * 0.0006;
      particleSystem.rotation.y = elapsedTime * 0.11 + currentMouse.x * 0.28 + scrollOffset;
      particleSystem.rotation.x =
        Math.sin(elapsedTime * 0.18) * 0.15 - currentMouse.y * 0.22 + scrollOffset * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // =========================================================
    // RESPONSIVE RESIZE
    // =========================================================
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const newPixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(newPixelRatio);

      uniforms.uPixelRatio.value = newPixelRatio;
      uniforms.uAspect.value = newWidth / newHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="webgl-particle-bg" aria-hidden="true" />;
}
