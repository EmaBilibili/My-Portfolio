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
  // Classic 3D Simplex Noise
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

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(
      permute(
        permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0)
      )
      + i.x + vec4(0.0, i1.x, i2.x, 1.0)
    );

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

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    float t = smoothstep(0.0, 1.0, uMorphProgress);

    // 1. Morphological interpolation between current and target cyber shape
    vec3 morphedPos = mix(position, aTargetPosition, t);
    vec3 morphedNorm = normalize(mix(normal, aTargetNormal, t) + vec3(0.0001));

    // 2. Organic 3D Simplex Noise wave along normal + subtle swirl during transition
    float transitionTurbulence = sin(t * 3.14159265) * 0.35;
    float primaryWave = snoise(morphedPos * 0.65 + vec3(uTime * 0.26));
    float secondaryWave = snoise(morphedPos * 1.45 - vec3(uTime * 0.4)) * 0.35;
    float combinedNoise = primaryWave + secondaryWave;

    float displacementAmp = 0.14 + transitionTurbulence;
    vec3 displacedPos = morphedPos + morphedNorm * (combinedNoise * displacementAmp);

    // 3. Project to view & clip space to evaluate cursor proximity
    vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);
    vec4 projected = projectionMatrix * mvPosition;
    vec2 ndcPos = projected.xy / max(projected.w, 0.0001);

    // Aspect-corrected distance to normalized cursor uMouse (-1 to 1)
    vec2 cursorDelta = ndcPos - uMouse;
    cursorDelta.x *= uAspect;
    float distToCursor = length(cursorDelta);

    // Organic fluid dispersion/repulsion when cursor approaches
    float influence = smoothstep(uMouseRadius, 0.0, distToCursor);
    influence = pow(influence, 1.35);

    vec2 repelDir = distToCursor > 0.0001 ? normalize(ndcPos - uMouse) : vec2(0.0, 1.0);
    float waveRipple = sin(distToCursor * 12.0 - uTime * 4.5);
    mvPosition.xy += repelDir * (influence * 0.78) + morphedNorm.xy * (influence * 0.22 * waveRipple);
    mvPosition.z += influence * 0.52 * waveRipple;

    gl_Position = projectionMatrix * mvPosition;

    // 4. Perspective-attenuated point size
    float baseSize = 15.0 + aRandom * 13.0 + influence * 15.0;
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
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float radialFalloff = 1.0 - (dist * 2.0);
    float glow = pow(radialFalloff, 2.2);

    // Refined palette: Slate Steel -> Platinum Silver -> Soft Iris Quartz
    vec3 colorDeep = vec3(0.42, 0.47, 0.64);
    vec3 colorMid = vec3(0.76, 0.79, 0.90);
    vec3 colorHighlight = vec3(0.95, 0.93, 0.98);
    vec3 colorCursor = vec3(0.80, 0.74, 0.98);

    float noiseFactor = smoothstep(-0.7, 0.85, vNoise);
    vec3 baseColor = mix(colorDeep, colorMid, noiseFactor);
    baseColor = mix(baseColor, colorHighlight, pow(noiseFactor, 2.3));

    vec3 finalColor = mix(baseColor, colorCursor, vInfluence * 0.85);

    float alpha = glow * (0.56 + 0.3 * vRandom + 0.25 * vInfluence);
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const PARTICLE_COUNT = 13000;

/**
 * Generates 5 Cybersecurity 3D Shapes with the exact same PARTICLE_COUNT (13,000):
 * 0: ESCUDO DEFENSIVO (Cyber Shield 3D)
 * 1: CANDADO CRIPTOGRÁFICO (3D Crypto Padlock)
 * 2: SENSOR / OJO SOC (Biometric Cyber Eye & Radar)
 * 3: HIPERCUBO FIREWALL (4D Tesseract Network Cube)
 * 4: RED GLOBAL DE NODOS (Meridian Cyber Globe & Orbits)
 */
function buildCyberShapes(count) {
  // Helper to push a vertex + normal into typed arrays
  const createBufferPair = () => ({
    positions: new Float32Array(count * 3),
    normals: new Float32Array(count * 3),
  });

  const setPoint = (pair, index, x, y, z, nx, ny, nz) => {
    const i3 = index * 3;
    pair.positions[i3] = x;
    pair.positions[i3 + 1] = y;
    pair.positions[i3 + 2] = z;
    const len = Math.hypot(nx, ny, nz) || 1;
    pair.normals[i3] = nx / len;
    pair.normals[i3 + 1] = ny / len;
    pair.normals[i3 + 2] = nz / len;
  };

  // =========================================================
  // SHAPE 0: CYBER SHIELD (Escudo Defensivo Blue Team)
  // =========================================================
  const shield = createBufferPair();
  const shieldHalfWidth = (h) => 2.05 * Math.pow(Math.max(h, 0.001), 0.56) * (1.0 - 0.14 * Math.pow(h, 2.8));

  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let x = 0;
    let y = 0;
    let z = 0;

    if (r < 0.38) {
      // Shield armored perimeter & bevel rim
      const h = Math.random();
      y = -2.35 + h * 4.5;
      const side = Math.random() < 0.5 ? -1 : 1;
      const w = shieldHalfWidth(h);
      if (h > 0.96 && Math.random() < 0.45) {
        // Top crest arch
        const u = (Math.random() - 0.5) * 2;
        x = u * shieldHalfWidth(1.0);
        y = 2.15 - 0.18 * Math.abs(u) + (Math.random() - 0.5) * 0.08;
      } else {
        x = side * (w - Math.random() * 0.14);
      }
      z = (Math.random() - 0.5) * 0.45;
    } else if (r < 0.56) {
      // Inner tactical chevron & central vertical spine
      if (Math.random() < 0.45) {
        // Vertical spine
        y = -1.9 + Math.random() * 3.7;
        x = (Math.random() - 0.5) * 0.14;
        z = (Math.random() < 0.5 ? 1 : -1) * (0.42 + Math.random() * 0.08);
      } else {
        // Inner V-Chevron emblem
        const arm = (Math.random() - 0.5) * 2.2;
        x = arm;
        y = 0.45 - Math.abs(arm) * 0.75 + (Math.random() - 0.5) * 0.12;
        z = (Math.random() < 0.5 ? 1 : -1) * 0.42;
      }
    } else {
      // Curved 3D shield face (front and back shells)
      const h = Math.pow(Math.random(), 0.72);
      y = -2.35 + h * 4.5;
      const maxW = shieldHalfWidth(h);
      const u = (Math.random() * 2 - 1);
      x = u * maxW;
      const curvature = Math.max(0, 1 - u * u);
      const face = Math.random() < 0.5 ? 1 : -1;
      z = face * (0.18 + 0.26 * curvature) + (Math.random() - 0.5) * 0.05;
    }

    setPoint(shield, i, x, y, z, x * 0.5, y * 0.2, z >= 0 ? 1 : -1);
  }

  // =========================================================
  // SHAPE 1: CRYPTO PADLOCK (Candado Criptográfico 3D)
  // =========================================================
  const padlock = createBufferPair();
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let x = 0;
    let y = 0;
    let z = 0;
    let nx = 0;
    let ny = 0;
    let nz = 1;

    if (r < 0.34) {
      // Top U-Shackle (Arco de acero del candado)
      const u = Math.random();
      const tubeAngle = Math.random() * Math.PI * 2;
      const tubeR = 0.22 + (Math.random() - 0.5) * 0.04;
      const majorR = 1.05;

      if (u < 0.65) {
        // Semicircular top arch
        const archAngle = (u / 0.65) * Math.PI;
        const cx = Math.cos(archAngle) * majorR;
        const cy = 1.15 + Math.sin(archAngle) * majorR;
        const radialX = Math.cos(archAngle);
        const radialY = Math.sin(archAngle);

        x = cx + radialX * Math.cos(tubeAngle) * tubeR;
        y = cy + radialY * Math.cos(tubeAngle) * tubeR;
        z = Math.sin(tubeAngle) * tubeR;
        nx = radialX * Math.cos(tubeAngle);
        ny = radialY * Math.cos(tubeAngle);
        nz = Math.sin(tubeAngle);
      } else {
        // Vertical shackle legs
        const side = Math.random() < 0.5 ? -1 : 1;
        x = side * majorR + Math.cos(tubeAngle) * tubeR;
        y = 0.25 + ((u - 0.65) / 0.35) * 0.9;
        z = Math.sin(tubeAngle) * tubeR;
        nx = Math.cos(tubeAngle);
        ny = 0;
        nz = Math.sin(tubeAngle);
      }
    } else if (r < 0.50) {
      // Central Keyhole Emblem (Ojo de cerradura)
      const side = Math.random() < 0.5 ? 1 : -1;
      z = side * (0.58 + (Math.random() - 0.5) * 0.04);
      if (Math.random() < 0.58) {
        // Keyhole circle
        const a = Math.random() * Math.PI * 2;
        const kr = 0.22 + Math.random() * 0.14;
        x = Math.cos(a) * kr;
        y = -0.68 + Math.sin(a) * kr;
      } else {
        // Keyhole vertical trapezoid slot
        const h = Math.random();
        y = -1.55 + h * 0.72;
        const slotW = 0.12 + (1 - h) * 0.12;
        x = (Math.random() * 2 - 1) * slotW;
      }
      nx = 0;
      ny = 0;
      nz = side;
    } else {
      // Padlock Vault Body (Cuerpo blindado con bordes biselados)
      const bw = 1.62;
      const bhTop = 0.28;
      const bhBot = -2.25;
      const bd = 0.55;

      const facePick = Math.random();
      if (facePick < 0.45) {
        // High-density edges & frame of the lock body
        const edge = Math.floor(Math.random() * 12);
        const t = Math.random();
        const jitter = () => (Math.random() - 0.5) * 0.08;
        if (edge < 4) {
          x = -bw + t * (bw * 2);
          y = (edge % 2 === 0 ? bhTop : bhBot) + jitter();
          z = (edge < 2 ? bd : -bd) + jitter();
        } else if (edge < 8) {
          x = (edge % 2 === 0 ? bw : -bw) + jitter();
          y = bhBot + t * (bhTop - bhBot);
          z = (edge < 6 ? bd : -bd) + jitter();
        } else {
          x = (edge % 2 === 0 ? bw : -bw) + jitter();
          y = (edge < 10 ? bhTop : bhBot) + jitter();
          z = -bd + t * (bd * 2);
        }
      } else {
        // Body surfaces
        x = (Math.random() * 2 - 1) * bw;
        y = bhBot + Math.random() * (bhTop - bhBot);
        z = (Math.random() < 0.5 ? 1 : -1) * bd + (Math.random() - 0.5) * 0.06;
      }
      nx = x;
      ny = y + 1.0;
      nz = z * 2;
    }

    setPoint(padlock, i, x, y, z, nx, ny, nz);
  }

  // =========================================================
  // SHAPE 2: SOC CYBER EYE / RADAR (Ojo de Monitoreo & SIEM)
  // =========================================================
  const cyberEye = createBufferPair();
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let x = 0;
    let y = 0;
    let z = 0;

    if (r < 0.36) {
      // Upper and lower almond eyelid arcs
      const u = (Math.random() * 2 - 1); // -1 to 1
      const lid = Math.random() < 0.5 ? 1 : -1;
      x = u * 2.65;
      const curve = 1.0 - u * u;
      y = lid * (1.28 * curve) + (Math.random() - 0.5) * 0.1;
      z = 0.45 * curve + (Math.random() - 0.5) * 0.22;
    } else if (r < 0.74) {
      // Biometric Iris Ring with radial scan fibers
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.52 + Math.random() * 0.72;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      z = 0.25 * Math.cos((radius - 0.52) * Math.PI) + (Math.random() - 0.5) * 0.12;
    } else if (r < 0.88) {
      // Dense Pupil Core Sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const rad = 0.34 * Math.cbrt(Math.random());
      x = rad * Math.sin(phi) * Math.cos(theta);
      y = rad * Math.sin(phi) * Math.sin(theta);
      z = rad * Math.cos(phi) + 0.25;
    } else {
      // Outer tactical HUD radar ring
      const angle = Math.random() * Math.PI * 2;
      const rad = 2.15 + (Math.random() - 0.5) * 0.08;
      x = Math.cos(angle) * rad;
      y = Math.sin(angle) * rad * 0.68;
      z = Math.sin(angle * 2) * 0.35;
    }

    setPoint(cyberEye, i, x, y, z, x * 0.4, y * 0.4, z + 0.8);
  }

  // =========================================================
  // SHAPE 3: FIREWALL TESSERACT (Hipercubo 4D de Red)
  // =========================================================
  const tesseract = createBufferPair();
  const vertices = [];
  for (let ix = -1; ix <= 1; ix += 2) {
    for (let iy = -1; iy <= 1; iy += 2) {
      for (let iz = -1; iz <= 1; iz += 2) {
        vertices.push([ix, iy, iz]);
      }
    }
  }
  const edges = [];
  for (let a = 0; a < 8; a++) {
    for (let b = a + 1; b < 8; b++) {
      const va = vertices[a];
      const vb = vertices[b];
      const diff = Math.abs(va[0] - vb[0]) + Math.abs(va[1] - vb[1]) + Math.abs(va[2] - vb[2]);
      if (diff === 2) edges.push([va, vb]);
    }
  }

  const outerScale = 1.95;
  const innerScale = 0.92;

  for (let i = 0; i < count; i++) {
    const r = Math.random();
    const jitter = () => (Math.random() - 0.5) * 0.11;
    let x = 0;
    let y = 0;
    let z = 0;

    if (r < 0.48) {
      // 12 Outer Cube Beams
      const [va, vb] = edges[i % 12];
      const t = Math.random();
      x = (va[0] + (vb[0] - va[0]) * t) * outerScale + jitter();
      y = (va[1] + (vb[1] - va[1]) * t) * outerScale + jitter();
      z = (va[2] + (vb[2] - va[2]) * t) * outerScale + jitter();
    } else if (r < 0.78) {
      // 12 Inner Cube Beams
      const [va, vb] = edges[i % 12];
      const t = Math.random();
      x = (va[0] + (vb[0] - va[0]) * t) * innerScale + jitter() * 0.7;
      y = (va[1] + (vb[1] - va[1]) * t) * innerScale + jitter() * 0.7;
      z = (va[2] + (vb[2] - va[2]) * t) * innerScale + jitter() * 0.7;
    } else {
      // 8 Diagonal 4D Connectors between Inner and Outer Cube vertices
      const v = vertices[i % 8];
      const t = Math.random();
      const s = innerScale + (outerScale - innerScale) * t;
      x = v[0] * s + jitter() * 0.65;
      y = v[1] * s + jitter() * 0.65;
      z = v[2] * s + jitter() * 0.65;
    }

    setPoint(tesseract, i, x, y, z, x, y, z);
  }

  // =========================================================
  // SHAPE 4: GLOBAL NETWORK MATRIX (Globo de Telemetría & Órbitas)
  // =========================================================
  const globe = createBufferPair();
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let x = 0;
    let y = 0;
    let z = 0;

    if (r < 0.72) {
      // Meridian & Parallel bands on a tactical sphere
      const radius = 2.05;
      let theta;
      let phi;
      if (Math.random() < 0.55) {
        // Quantized longitude meridians (12 bands)
        const meridianIdx = Math.floor(Math.random() * 12);
        theta = (meridianIdx / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.04;
        phi = Math.acos(2.0 * Math.random() - 1.0);
      } else {
        // Quantized latitude parallels (9 bands)
        const latIdx = Math.floor(Math.random() * 9) + 1;
        phi = (latIdx / 10) * Math.PI + (Math.random() - 0.5) * 0.03;
        theta = Math.random() * Math.PI * 2;
      }
      x = radius * Math.sin(phi) * Math.cos(theta);
      y = radius * Math.cos(phi);
      z = radius * Math.sin(phi) * Math.sin(theta);
    } else {
      // Dual Tilted Satellite Telemetry Orbits
      const orbitIdx = i % 2;
      const orbitRadius = orbitIdx === 0 ? 2.65 : 2.95;
      const tilt = orbitIdx === 0 ? 0.52 : -0.58;
      const angle = Math.random() * Math.PI * 2;

      const ox = Math.cos(angle) * orbitRadius;
      const oz = Math.sin(angle) * orbitRadius;
      const oy = (Math.random() - 0.5) * 0.08;

      x = ox;
      y = oy * Math.cos(tilt) - oz * Math.sin(tilt);
      z = oy * Math.sin(tilt) + oz * Math.cos(tilt);
    }

    setPoint(globe, i, x, y, z, x, y, z);
  }

  return [shield, padlock, cyberEye, tesseract, globe];
}

export default function DefenseRadarScene({ activeShapeIndex = 0 }) {
  const mountRef = useRef(null);
  const targetShapeRef = useRef(0);

  useEffect(() => {
    targetShapeRef.current = activeShapeIndex;
  }, [activeShapeIndex]);

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

    // Build all 5 Cybersecurity 3D shapes with identical vertex count
    const shapes = buildCyberShapes(PARTICLE_COUNT);
    const randoms = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      randoms[i] = Math.random();
    }

    const posAttr = new THREE.BufferAttribute(new Float32Array(shapes[0].positions), 3);
    const normAttr = new THREE.BufferAttribute(new Float32Array(shapes[0].normals), 3);
    const targetPosAttr = new THREE.BufferAttribute(new Float32Array(shapes[1].positions), 3);
    const targetNormAttr = new THREE.BufferAttribute(new Float32Array(shapes[1].normals), 3);

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', posAttr);
    particlesGeometry.setAttribute('normal', normAttr);
    particlesGeometry.setAttribute('aTargetPosition', targetPosAttr);
    particlesGeometry.setAttribute('aTargetNormal', targetNormAttr);
    particlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    const uniforms = {
      uTime: { value: 0 },
      uMorphProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uMouseRadius: { value: 0.44 },
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

    // State for multi-shape morphing
    let currentTargetIdx = 0;
    let morphProgress = 1;

    const triggerMorphTo = (nextIdx) => {
      const normalizedNext = ((nextIdx % shapes.length) + shapes.length) % shapes.length;
      if (normalizedNext === currentTargetIdx) return;

      // Bake current interpolated position as the new source so mid-flight changes are 100% smooth
      const t = uniforms.uMorphProgress.value;
      const srcP = posAttr.array;
      const dstP = targetPosAttr.array;
      const srcN = normAttr.array;
      const dstN = targetNormAttr.array;

      for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        srcP[i] = srcP[i] + (dstP[i] - srcP[i]) * t;
        srcN[i] = srcN[i] + (dstN[i] - srcN[i]) * t;
      }
      posAttr.needsUpdate = true;
      normAttr.needsUpdate = true;

      // Load the new target shape into aTargetPosition / aTargetNormal
      targetPosAttr.array.set(shapes[normalizedNext].positions);
      targetNormAttr.array.set(shapes[normalizedNext].normals);
      targetPosAttr.needsUpdate = true;
      targetNormAttr.needsUpdate = true;

      currentTargetIdx = normalizedNext;
      morphProgress = 0;
      uniforms.uMorphProgress.value = 0;
    };

    container._morphToShape = triggerMorphTo;

    // Pointer tracking
    const targetMouse = new THREE.Vector2(0, 0);
    const currentMouse = new THREE.Vector2(0, 0);
    let pointerActive = false;

    const handlePointerMove = (event) => {
      pointerActive = true;
      targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.getElapsedTime();
      uniforms.uTime.value = elapsedTime;

      // Check if target shape changed
      if (targetShapeRef.current !== currentTargetIdx) {
        triggerMorphTo(targetShapeRef.current);
      }

      // Smoothly advance morph progress from 0 -> 1
      if (morphProgress < 1) {
        morphProgress = Math.min(1, morphProgress + delta * 0.95);
        uniforms.uMorphProgress.value = morphProgress;
      }

      // Smoothly interpolate cursor coordinates
      if (pointerActive) {
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.085;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.085;
        uniforms.uMouse.value.copy(currentMouse);
      }

      // Subtle, readable 3D oscillation so each cybersecurity symbol is clearly recognizable
      particleSystem.rotation.y = Math.sin(elapsedTime * 0.35) * 0.38 + currentMouse.x * 0.32;
      particleSystem.rotation.x = Math.cos(elapsedTime * 0.25) * 0.14 - currentMouse.y * 0.22;

      renderer.render(scene, camera);
    };

    animate();

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
