'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Node3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  phase: number;
  speed: number;
  radius: number;
}

export function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 85;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      // Gracefully exit if WebGL is unavailable
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.domElement.className = 'interactive-bg-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.left = '0px';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    // Mouse Tracking in 3D NDC space
    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      worldX: 0,
      worldY: 0,
      isActive: false,
    };

    // Node Count & Boundaries
    const isMobile = width < 768;
    const NODE_COUNT = isMobile ? 45 : 75;
    const BOUNDS_X = isMobile ? 45 : 75;
    const BOUNDS_Y = isMobile ? 40 : 50;
    const BOUNDS_Z = 28;
    const CONNECT_DIST = isMobile ? 18 : 23;
    const MAX_LINES = isMobile ? 220 : 420;
    const CURSOR_INFLUENCE_DIST = 26;

    // Create Nodes
    const nodes: Node3D[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const bx = (Math.random() - 0.5) * 2 * BOUNDS_X;
      const by = (Math.random() - 0.5) * 2 * BOUNDS_Y;
      const bz = (Math.random() - 0.5) * 2 * BOUNDS_Z;
      nodes.push({
        baseX: bx,
        baseY: by,
        baseZ: bz,
        x: bx,
        y: by,
        z: bz,
        vx: 0,
        vy: 0,
        vz: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.75 + Math.random() * 0.65,
        radius: 1.5 + Math.random() * 1.5,
      });
    }

    // Node Points Buffer
    const pointGeo = new THREE.BufferGeometry();
    const pointPositions = new Float32Array(NODE_COUNT * 3);
    const pointColors = new Float32Array(NODE_COUNT * 3);

    // Soft circle canvas texture for glowing particles
    const createParticleTexture = () => {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      const ctx = c.getContext('2d');
      if (!ctx) return null;
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(200, 255, 101, 0.85)');
      grad.addColorStop(0.7, 'rgba(170, 140, 255, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
      const texture = new THREE.CanvasTexture(c);
      texture.premultiplyAlpha = true;
      return texture;
    };

    const particleTexture = createParticleTexture();
    const pointMat = new THREE.PointsMaterial({
      size: isMobile ? 4.5 : 5.5,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const pointCloud = new THREE.Points(pointGeo, pointMat);
    scene.add(pointCloud);

    // Pre-allocated LineSegments Buffer
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(MAX_LINES * 6); // 2 vertices per line * 3 coords
    const lineColors = new Float32Array(MAX_LINES * 6);    // 2 vertices per line * 3 RGB channels

    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 1,
    });

    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegments);

    // Accent Colors: Lime (#c8ff65) & Violet (#aa8cff)
    const colorLime = new THREE.Color(0xc8ff65);
    const colorViolet = new THREE.Color(0xaa8cff);
    const colorDim = new THREE.Color(0x3a482d);

    // Subtle 3D background wave grid lines
    const gridPoints: THREE.Vector3[] = [];
    const GRID_SIZE = 60;
    const GRID_STEP = 15;
    for (let x = -GRID_SIZE; x <= GRID_SIZE; x += GRID_STEP) {
      gridPoints.push(new THREE.Vector3(x, -BOUNDS_Y - 5, -20));
      gridPoints.push(new THREE.Vector3(x, BOUNDS_Y + 5, -20));
    }
    const bgGridGeo = new THREE.BufferGeometry().setFromPoints(gridPoints);
    const bgGridMat = new THREE.LineBasicMaterial({
      color: 0x161e12,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });
    const bgGrid = new THREE.LineSegments(bgGridGeo, bgGridMat);
    scene.add(bgGrid);

    // Pointer Event Listeners
    const onPointerMove = (e: PointerEvent) => {
      mouse.isActive = true;
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onPointerLeave = () => {
      mouse.isActive = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);

    // Resize Handler
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId = 0;
    let clock = 0;
    let isVisible = true;

    const onVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible || prefersReducedMotion) {
        if (prefersReducedMotion) renderer.render(scene, camera);
        return;
      }

      clock += 0.016;

      // Smooth mouse lerp
      if (mouse.isActive) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // Unproject cursor to z=0 plane in 3D world space
        const v = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        v.unproject(camera);
        const dir = v.sub(camera.position).normalize();
        const dist = -camera.position.z / dir.z;
        const worldPos = camera.position.clone().add(dir.multiplyScalar(dist));
        mouse.worldX = worldPos.x;
        mouse.worldY = worldPos.y;
      } else {
        // Ambient drifting attractor when idle/mobile (tuned slightly faster)
        mouse.worldX = Math.sin(clock * 0.9) * (BOUNDS_X * 0.45);
        mouse.worldY = Math.cos(clock * 0.75) * (BOUNDS_Y * 0.45);
      }

      // Update Nodes Physics & Positions
      let pointIdx = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i];

        // Harmonic organic base motion (tuned slightly faster and more dynamic)
        const floatX = Math.sin(clock * n.speed + n.phase) * 2.4;
        const floatY = Math.cos(clock * n.speed * 0.85 + n.phase) * 2.4;
        const floatZ = Math.sin(clock * n.speed * 0.7 + n.phase) * 2.0;

        const targetX = n.baseX + floatX;
        const targetY = n.baseY + floatY;
        const targetZ = n.baseZ + floatZ;

        // Interactive Gravitational / Antigravity Cursor Force
        const dx = n.x - mouse.worldX;
        const dy = n.y - mouse.worldY;
        const distToCursor = Math.sqrt(dx * dx + dy * dy);

        if (distToCursor < CURSOR_INFLUENCE_DIST && distToCursor > 0.1) {
          const forceFactor = (1 - distToCursor / CURSOR_INFLUENCE_DIST);
          // Antigravity repulsion with spring cushion
          const repulse = forceFactor * 2.8;
          n.vx += (dx / distToCursor) * repulse;
          n.vy += (dy / distToCursor) * repulse;
          n.vz += (Math.sin(n.phase) * forceFactor) * 1.5;
        }

        // Spring restitution back toward target anchor
        n.vx += (targetX - n.x) * 0.045;
        n.vy += (targetY - n.y) * 0.045;
        n.vz += (targetZ - n.z) * 0.045;

        // Damping
        n.vx *= 0.88;
        n.vy *= 0.88;
        n.vz *= 0.88;

        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;

        pointPositions[pointIdx] = n.x;
        pointPositions[pointIdx + 1] = n.y;
        pointPositions[pointIdx + 2] = n.z;

        // Particle color: pulses slightly when near mouse
        const isNearCursor = distToCursor < CURSOR_INFLUENCE_DIST;
        const pColor = isNearCursor ? colorLime : colorDim;
        pointColors[pointIdx] = pColor.r;
        pointColors[pointIdx + 1] = pColor.g;
        pointColors[pointIdx + 2] = pColor.b;

        pointIdx += 3;
      }

      pointGeo.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
      pointGeo.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));
      pointGeo.attributes.position.needsUpdate = true;
      pointGeo.attributes.color.needsUpdate = true;

      // Calculate Dynamic 3D Connecting Lines
      let lineCount = 0;
      let linePosIdx = 0;
      let lineColIdx = 0;

      for (let i = 0; i < NODE_COUNT && lineCount < MAX_LINES; i++) {
        const ni = nodes[i];
        for (let j = i + 1; j < NODE_COUNT && lineCount < MAX_LINES; j++) {
          const nj = nodes[j];

          const lx = ni.x - nj.x;
          const ly = ni.y - nj.y;
          const lz = ni.z - nj.z;
          const lineDist = Math.sqrt(lx * lx + ly * ly + lz * lz);

          if (lineDist < CONNECT_DIST) {
            const alpha = 1 - lineDist / CONNECT_DIST;

            // Line vertices
            linePositions[linePosIdx++] = ni.x;
            linePositions[linePosIdx++] = ni.y;
            linePositions[linePosIdx++] = ni.z;

            linePositions[linePosIdx++] = nj.x;
            linePositions[linePosIdx++] = nj.y;
            linePositions[linePosIdx++] = nj.z;

            // Line colors: dynamic blend of Lime & Violet based on cursor proximity
            const distI = Math.hypot(ni.x - mouse.worldX, ni.y - mouse.worldY);
            const distJ = Math.hypot(nj.x - mouse.worldX, nj.y - mouse.worldY);
            const minCursorDist = Math.min(distI, distJ);

            let intensity = alpha * 0.45;
            let c: THREE.Color;

            if (minCursorDist < CURSOR_INFLUENCE_DIST) {
              const boost = (1 - minCursorDist / CURSOR_INFLUENCE_DIST);
              intensity = Math.min(1.0, intensity + boost * 0.65);
              c = colorLime;
            } else {
              c = ((i + j) % 3 === 0) ? colorViolet : colorLime;
            }

            lineColors[lineColIdx++] = c.r * intensity;
            lineColors[lineColIdx++] = c.g * intensity;
            lineColors[lineColIdx++] = c.b * intensity;

            lineColors[lineColIdx++] = c.r * intensity;
            lineColors[lineColIdx++] = c.g * intensity;
            lineColors[lineColIdx++] = c.b * intensity;

            lineCount++;
          }
        }
      }

      lineGeo.setDrawRange(0, lineCount * 2);
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      // Subtle camera parallax sway + scroll parallax
      const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
      const targetCamY = (mouse.y * 2.5) - (scrollY * 0.012);
      camera.position.x += ((mouse.x * 3.5) - camera.position.x) * 0.02;
      camera.position.y += (targetCamY - camera.position.y) * 0.02;
      camera.lookAt(0, -scrollY * 0.012, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      pointGeo.dispose();
      pointMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      bgGridGeo.dispose();
      bgGridMat.dispose();
      particleTexture?.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="interactive-bg-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    />
  );
}
