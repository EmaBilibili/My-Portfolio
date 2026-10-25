import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * DefenseRadarScene
 * Visualización 3D interactiva en Three.js con temática SOC / Blue Team:
 * - Esfera táctica wireframe (núcleo de telemetría defensiva)
 * - Anillos concéntricos de radar/sensores
 * - Nodos de red distribuidos como puntos de telemetría
 * - Rotación procedural reactiva al puntero
 * - Detección de visibilidad para suspender el render loop si sale de pantalla
 * - Soporte para 'prefers-reduced-motion'
 */
export default function DefenseRadarScene({ pulseTrigger = 0 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Verificar preferencia de reducción de movimiento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Escena, cámara y renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.NoToneMapping;
    container.appendChild(renderer.domElement);

    // Contenedor principal para rotaciones
    const radarGroup = new THREE.Group();
    scene.add(radarGroup);

    // 1. Núcleo Icosaédrico Wireframe (Estilo sensor geodésico)
    const coreGeo = new THREE.IcosahedronGeometry(2, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x222222,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    radarGroup.add(coreMesh);

    // 2. Esfera interna más densa y oscura
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0a0a0a,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    radarGroup.add(innerMesh);

    // 3. Nodos de Sensores / Partículas en vértices
    const particleCount = 70;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const radius = 2.05 + (Math.random() - 0.5) * 0.1;

      particlePositions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      particlePositions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x111111,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    radarGroup.add(particles);

    // 4. Anillos orbitales tácticos (Radar / Scanning Rings)
    const createRing = (radius, tiltX, tiltY) => {
      const ringGeo = new THREE.BufferGeometry();
      const segments = 64;
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }
      ringGeo.setFromPoints(points);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.45,
      });
      const ring = new THREE.Line(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      return ring;
    };

    const ring1 = createRing(2.6, Math.PI / 3, 0);
    const ring2 = createRing(3.0, -Math.PI / 4, Math.PI / 6);
    radarGroup.add(ring1);
    radarGroup.add(ring2);

    // 5. Línea de Escaneo de Radar (Sweep segment)
    const sweepGeo = new THREE.BufferGeometry();
    sweepGeo.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(2.5, 0, 0)]);
    const sweepMat = new THREE.LineBasicMaterial({
      color: 0x1a1a1a,
      transparent: true,
      opacity: 0.7,
    });
    const sweepLine = new THREE.Line(sweepGeo, sweepMat);
    sweepLine.rotation.z = 0;
    radarGroup.add(sweepLine);

    // Variables de interacción con el ratón
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      mouseX = x / (window.innerWidth * 0.5);
      mouseY = y / (window.innerHeight * 0.5);
      targetRotationY = mouseX * 0.8;
      targetRotationX = mouseY * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Observador para detener el loop si no está visible
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animación
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Rotación continua
        coreMesh.rotation.y += delta * 0.15;
        coreMesh.rotation.x += delta * 0.08;

        innerMesh.rotation.y -= delta * 0.2;
        innerMesh.rotation.z += delta * 0.1;

        particles.rotation.y += delta * 0.12;

        ring1.rotation.z += delta * 0.25;
        ring2.rotation.z -= delta * 0.2;

        sweepLine.rotation.z = time * 1.5;

        // Suave inercia (damping) al mover el cursor
        radarGroup.rotation.y += (targetRotationY - radarGroup.rotation.y) * 0.04;
        radarGroup.rotation.x += (targetRotationX - radarGroup.rotation.x) * 0.04;

        // Pequeño flotado senoidal sutil
        radarGroup.position.y = Math.sin(time * 0.8) * 0.08;
      }
      renderer.render(scene, camera);
    };

    animate();

    // Redimensionamiento
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Efecto de pulso reactivo en el contenedor guardado
    container._radarPulse = () => {
      // Breve destello en los anillos y nodos
      coreMat.color.setHex(0x555555);
      coreMat.opacity = 0.95;
      ring1.material.color.setHex(0x777777);
      ring2.material.color.setHex(0x777777);
      particles.material.color.setHex(0x333333);

      setTimeout(() => {
        coreMat.color.setHex(0x222222);
        coreMat.opacity = 0.65;
        ring1.material.color.setHex(0x333333);
        ring2.material.color.setHex(0x333333);
        particles.material.color.setHex(0x111111);
      }, 450);
    };

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      ring1.geometry.dispose();
      ring1.material.dispose();
      ring2.geometry.dispose();
      ring2.material.dispose();
      sweepGeo.dispose();
      sweepMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Efecto cuando cambia pulseTrigger
  useEffect(() => {
    if (pulseTrigger && mountRef.current?._radarPulse) {
      mountRef.current._radarPulse();
    }
  }, [pulseTrigger]);

  return (
    <div
      ref={mountRef}
      className="defense-radar-canvas"
      aria-hidden="true"
    />
  );
}
