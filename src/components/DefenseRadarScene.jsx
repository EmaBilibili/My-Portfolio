import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Full-Viewport Interactive Three.js Background — Cyber Terminal & Network Topology
 * - Fixed full-screen WebGL canvas behind the entire portfolio
 * - 3D Network Nodes + Dynamic Synapse Lines
 * - Live Cursor Probe: connects the user's mouse in 3D space to nearby network nodes
 * - Scroll Choreography: camera travels through the 3D topology & horizon grids as user scrolls
 * - Shockwave Scan Rings: triggered on click, terminal commands, or UI interactions
 */
export default function DefenseRadarScene({ pulseTrigger = 0 }) {
  const mountRef = useRef(null);
  const hudCoordsRef = useRef(null);
  const [scanStatus, setScanStatus] = useState('IDLE // PASSIVE_MONITOR');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060809, 0.045);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 120);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // =========================================================
    // 1. 3D HORIZON CYBER GRIDS (FLOOR & CEILING)
    // =========================================================
    const gridHelperBottom = new THREE.GridHelper(90, 45, 0x10b981, 0x16221e);
    gridHelperBottom.position.y = -7.5;
    gridHelperBottom.material.transparent = true;
    gridHelperBottom.material.opacity = 0.25;
    scene.add(gridHelperBottom);

    const gridHelperTop = new THREE.GridHelper(90, 45, 0x10b981, 0x131c19);
    gridHelperTop.position.y = 7.5;
    gridHelperTop.material.transparent = true;
    gridHelperTop.material.opacity = 0.14;
    scene.add(gridHelperTop);

    // =========================================================
    // 2. INTERACTIVE 3D NETWORK NODES (PARTICLES)
    // =========================================================
    const NODE_COUNT = 115;
    const nodePositions = new Float32Array(NODE_COUNT * 3);
    const nodeVelocities = [];
    const spreadX = 28;
    const spreadY = 14;
    const spreadZ = 26;

    for (let i = 0; i < NODE_COUNT; i++) {
      nodePositions[i * 3] = (Math.random() - 0.5) * spreadX;
      nodePositions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
      nodePositions[i * 3 + 2] = (Math.random() - 0.5) * spreadZ - 2;

      nodeVelocities.push({
        vx: (Math.random() - 0.5) * 0.014,
        vy: (Math.random() - 0.5) * 0.014,
        vz: (Math.random() - 0.5) * 0.012,
      });
    }

    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    const nodesMat = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 0.14,
      transparent: true,
      opacity: 0.85,
    });

    const nodesPoints = new THREE.Points(nodesGeo, nodesMat);
    scene.add(nodesPoints);

    // =========================================================
    // 3. DYNAMIC NETWORK CONNECTIONS (NODE-TO-NODE & CURSOR-TO-NODE)
    // =========================================================
    const maxSegments = NODE_COUNT * 10;
    const linePositions = new Float32Array(maxSegments * 6);
    const lineColors = new Float32Array(maxSegments * 6);

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const linesMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    const networkLines = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(networkLines);

    // =========================================================
    // 4. CURSOR 3D PROBE TARGET RETICLE
    // =========================================================
    const probeGroup = new THREE.Group();
    const probeRingGeo = new THREE.RingGeometry(0.28, 0.33, 24);
    const probeRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const probeRing = new THREE.Mesh(probeRingGeo, probeRingMat);
    probeGroup.add(probeRing);

    const probeInnerGeo = new THREE.RingGeometry(0.06, 0.09, 16);
    const probeInner = new THREE.Mesh(probeInnerGeo, probeRingMat);
    probeGroup.add(probeInner);
    scene.add(probeGroup);

    // =========================================================
    // 5. EXPANDING SHOCKWAVE / PACKET SCAN RINGS
    // =========================================================
    const shockwaves = [];
    const spawnShockwave = (originX = 0, originY = 0, colorHex = 0x10b981) => {
      const ringGeo = new THREE.RingGeometry(0.2, 0.32, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(ringGeo, ringMat);
      mesh.position.set(originX, originY, 2);
      scene.add(mesh);
      shockwaves.push({ mesh, scale: 1, opacity: 0.85 });
    };

    // =========================================================
    // 6. POINTER, SCROLL & CUSTOM EVENT LISTENERS
    // =========================================================
    const mouseNDC = new THREE.Vector2(0, 0);
    const cursor3D = new THREE.Vector3(0, 0, 2);
    const raycasterPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2);
    const raycaster = new THREE.Raycaster();
    let scrollProgress = 0;
    let boostEnergy = 0;

    const updateMousePosition = (clientX, clientY) => {
      mouseNDC.x = (clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(raycasterPlane, cursor3D);

      if (hudCoordsRef.current) {
        const xStr = cursor3D.x.toFixed(2).padStart(6, ' ');
        const yStr = cursor3D.y.toFixed(2).padStart(6, ' ');
        const scrollPct = Math.round(scrollProgress * 100)
          .toString()
          .padStart(3, '0');
        hudCoordsRef.current.textContent = `PROBE_XY:[${xStr}, ${yStr}] // DEPTH:${scrollPct}%`;
      }
    };

    const handleMouseMove = (event) => {
      updateMousePosition(event.clientX, event.clientY);
    };

    const handleMouseDown = (event) => {
      updateMousePosition(event.clientX, event.clientY);
      spawnShockwave(cursor3D.x, cursor3D.y, 0x10b981);
      boostEnergy = Math.min(boostEnergy + 0.7, 1.5);
    };

    const handleScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollProgress = window.scrollY / maxScroll;
    };

    const handleCustomPulse = (event) => {
      const detail = event.detail || {};
      const color = detail.color || 0x10b981;
      spawnShockwave(cursor3D.x * 0.5, cursor3D.y * 0.5, color);
      boostEnergy = 1.2;
      setScanStatus('ACTIVE // PACKET_BURST_DETECTED');
      window.setTimeout(() => setScanStatus('IDLE // PASSIVE_MONITOR'), 1400);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('cyber-pulse', handleCustomPulse);
    handleScroll();

    // Store trigger function on container for React prop updates
    container._triggerScan = () => {
      spawnShockwave(0, 0, 0x34d399);
      spawnShockwave(cursor3D.x * 0.4, cursor3D.y * 0.4, 0xffffff);
      boostEnergy = 1.5;
      setScanStatus('EXEC // TERMINAL_SCAN_PULSE');
      window.setTimeout(() => setScanStatus('IDLE // PASSIVE_MONITOR'), 1600);
    };

    // =========================================================
    // 7. RENDER & PHYSICS LOOP
    // =========================================================
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      boostEnergy = Math.max(0, boostEnergy - delta * 0.8);

      // Smoothly move camera based on scroll + mouse parallax
      const targetCamZ = 14 - scrollProgress * 8.5;
      const targetCamY = -scrollProgress * 2.2 + mouseNDC.y * 0.65;
      const targetCamX = mouseNDC.x * 0.95;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(mouseNDC.x * 0.3, -scrollProgress * 1.5, 0);

      // Animate horizon grids
      gridHelperBottom.position.z = (elapsed * 1.2) % 2;
      gridHelperTop.position.z = (elapsed * 1.2) % 2;

      // Update 3D cursor probe reticle
      probeGroup.position.lerp(cursor3D, 0.22);
      probeGroup.rotation.z = elapsed * 1.4;
      const probeScale = 1 + Math.sin(elapsed * 4) * 0.1 + boostEnergy * 0.35;
      probeGroup.scale.set(probeScale, probeScale, 1);

      // Update shockwave rings
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.scale += delta * 24;
        sw.opacity -= delta * 0.95;
        sw.mesh.scale.set(sw.scale, sw.scale, 1);
        sw.mesh.material.opacity = Math.max(0, sw.opacity);
        if (sw.opacity <= 0) {
          scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          sw.mesh.material.dispose();
          shockwaves.splice(i, 1);
        }
      }

      // Update node positions & compute synapse connections
      const posAttr = nodesGeo.attributes.position;
      const posArray = posAttr.array;
      const speedMult = prefersReducedMotion ? 0.15 : 1 + boostEnergy * 2.2;

      for (let i = 0; i < NODE_COUNT; i++) {
        const idx = i * 3;
        posArray[idx] += nodeVelocities[i].vx * speedMult;
        posArray[idx + 1] += nodeVelocities[i].vy * speedMult;
        posArray[idx + 2] += nodeVelocities[i].vz * speedMult;

        // Wrap around bounds
        if (posArray[idx] > spreadX / 2) posArray[idx] = -spreadX / 2;
        if (posArray[idx] < -spreadX / 2) posArray[idx] = spreadX / 2;
        if (posArray[idx + 1] > spreadY / 2) posArray[idx + 1] = -spreadY / 2;
        if (posArray[idx + 1] < -spreadY / 2) posArray[idx + 1] = spreadY / 2;
        if (posArray[idx + 2] > 6) posArray[idx + 2] = -spreadZ + 6;
        if (posArray[idx + 2] < -spreadZ + 6) posArray[idx + 2] = 6;
      }
      posAttr.needsUpdate = true;

      // Rebuild dynamic lines (node-to-node + cursor-to-node)
      let segmentCount = 0;
      const connectionDistSq = 13.5;
      const cursorDistSq = 22.0;

      for (let i = 0; i < NODE_COUNT; i++) {
        const ix = posArray[i * 3];
        const iy = posArray[i * 3 + 1];
        const iz = posArray[i * 3 + 2];

        // Check connection to user's 3D cursor probe
        const dxCursor = ix - cursor3D.x;
        const dyCursor = iy - cursor3D.y;
        const dzCursor = iz - cursor3D.z;
        const distCursorSq = dxCursor * dxCursor + dyCursor * dyCursor + dzCursor * dzCursor * 0.35;

        if (distCursorSq < cursorDistSq && segmentCount < maxSegments) {
          const alpha = 1 - distCursorSq / cursorDistSq;
          const base = segmentCount * 6;
          linePositions[base] = ix;
          linePositions[base + 1] = iy;
          linePositions[base + 2] = iz;
          linePositions[base + 3] = cursor3D.x;
          linePositions[base + 4] = cursor3D.y;
          linePositions[base + 5] = cursor3D.z;

          // Bright emerald trace line to cursor
          lineColors[base] = 0.06 * alpha;
          lineColors[base + 1] = 0.85 * alpha;
          lineColors[base + 2] = 0.55 * alpha;
          lineColors[base + 3] = 0.25 * alpha;
          lineColors[base + 4] = 1.0 * alpha;
          lineColors[base + 5] = 0.7 * alpha;
          segmentCount++;
        }

        // Check node-to-node connections
        for (let j = i + 1; j < NODE_COUNT; j++) {
          if (segmentCount >= maxSegments) break;
          const jx = posArray[j * 3];
          const jy = posArray[j * 3 + 1];
          const jz = posArray[j * 3 + 2];

          const dx = ix - jx;
          const dy = iy - jy;
          const dz = iz - jz;
          const dSq = dx * dx + dy * dy + dz * dz;

          if (dSq < connectionDistSq) {
            const intensity = (1 - dSq / connectionDistSq) * (0.35 + boostEnergy * 0.45);
            const base = segmentCount * 6;
            linePositions[base] = ix;
            linePositions[base + 1] = iy;
            linePositions[base + 2] = iz;
            linePositions[base + 3] = jx;
            linePositions[base + 4] = jy;
            linePositions[base + 5] = jz;

            lineColors[base] = 0.05 * intensity;
            lineColors[base + 1] = 0.55 * intensity;
            lineColors[base + 2] = 0.38 * intensity;
            lineColors[base + 3] = 0.05 * intensity;
            lineColors[base + 4] = 0.55 * intensity;
            lineColors[base + 5] = 0.38 * intensity;
            segmentCount++;
          }
        }
      }

      linesGeo.setDrawRange(0, segmentCount * 2);
      linesGeo.attributes.position.needsUpdate = true;
      linesGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cyber-pulse', handleCustomPulse);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      nodesGeo.dispose();
      nodesMat.dispose();
      linesGeo.dispose();
      linesMat.dispose();
      probeRingGeo.dispose();
      probeInnerGeo.dispose();
      probeRingMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (pulseTrigger && mountRef.current?._triggerScan) {
      mountRef.current._triggerScan();
    }
  }, [pulseTrigger]);

  return (
    <div className="cyber-bg-wrapper" aria-hidden="true">
      <div ref={mountRef} className="cyber-bg-canvas" />
      <div className="cyber-hud-bar">
        <span className="cyber-hud-status">
          <i /> SYS_TOPOLOGY // {scanStatus}
        </span>
        <span ref={hudCoordsRef} className="cyber-hud-coords">
          PROBE_XY:[  0.00,   0.00] // DEPTH:000%
        </span>
      </div>
    </div>
  );
}
