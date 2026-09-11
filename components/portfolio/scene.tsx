'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Move3d } from 'lucide-react';
import type * as THREE from 'three';

export function PortraitScene({ motion }: { motion: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const motionRef = useRef(motion);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    motionRef.current = motion;
  }, [motion]);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let disposed = false;
    let frame = 0;
    let cleanup = () => {};

    import('three')
      .then(T => {
        if (disposed) return;
        let renderer: THREE.WebGLRenderer;
        try {
          renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        } catch {
          setFailed(true);
          return;
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
        renderer.outputColorSpace = T.SRGBColorSpace;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;

        const canvas = renderer.domElement;
        canvas.setAttribute('aria-hidden', 'true');
        canvas.className = 'scene-canvas';
        container.appendChild(canvas);

        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(36, 1, 0.1, 50);
        camera.position.set(0, 0, 7.2);

        const mainGroup = new T.Group();
        scene.add(mainGroup);

        const orbitGroup = new T.Group();
        scene.add(orbitGroup);

        // Ambient and directional lighting for a rich studio aesthetic
        const ambientLight = new T.AmbientLight(0xffffff, 2.0);
        scene.add(ambientLight);

        const keyLight = new T.DirectionalLight(0xd4ff88, 3.8);
        keyLight.position.set(3.5, 4, 4.5);
        scene.add(keyLight);

        const violetRim = new T.PointLight(0xa582ff, 22, 14);
        violetRim.position.set(-3.5, -2, 2.8);
        scene.add(violetRim);

        const limeRim = new T.PointLight(0xc8ff65, 14, 12);
        limeRim.position.set(3, 2, -1);
        scene.add(limeRim);

        const resources: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];
        function mesh(g: THREE.BufferGeometry, m: THREE.Material) {
          resources.push(g, m);
          return new T.Mesh(g, m);
        }

        // Sleek backing plate with soft rounded aesthetic
        const backPlate = mesh(
          new T.BoxGeometry(2.9, 3.65, 0.08),
          new T.MeshStandardMaterial({
            color: 0x141812,
            metalness: 0.85,
            roughness: 0.25,
          })
        );
        mainGroup.add(backPlate);

        // Subtle soft rim highlight instead of a harsh wireframe
        const rimEdges = mesh(
          new T.EdgesGeometry(backPlate.geometry),
          new T.LineBasicMaterial({ color: 0x8fc455, transparent: true, opacity: 0.45 })
        );
        mainGroup.add(rimEdges);

        // Backglow plane behind portrait for ambient depth
        const glowGeo = new T.PlaneGeometry(3.5, 4.3);
        const glowMat = new T.MeshBasicMaterial({
          color: 0x223315,
          transparent: true,
          opacity: 0.35,
        });
        const backGlow = mesh(glowGeo, glowMat);
        backGlow.position.z = -0.06;
        mainGroup.add(backGlow);

        // Load portrait texture
        const texture = new T.TextureLoader().load(
          '/images/kalhara-avatar-3d.png',
          tex => {
            if (disposed) {
              tex.dispose();
              return;
            }
            tex.colorSpace = T.SRGBColorSpace;
            const photoPlane = mesh(
              new T.PlaneGeometry(2.82, 3.55),
              new T.MeshBasicMaterial({
                map: tex,
                transparent: true,
              })
            );
            photoPlane.position.z = 0.045;
            mainGroup.add(photoPlane);
            setReady(true);
            renderer.render(scene, camera);
          },
          undefined,
          () => {
            if (!disposed) setFailed(true);
          }
        );
        resources.push(texture);

        // Orbital rings with high-tech sleek geometry
        const ring1 = mesh(
          new T.TorusGeometry(2.35, 0.007, 8, 160),
          new T.MeshBasicMaterial({ color: 0xc8ff65, transparent: true, opacity: 0.38 })
        );
        ring1.rotation.set(0.85, -0.4, 0.15);
        orbitGroup.add(ring1);

        const ring2 = mesh(
          new T.TorusGeometry(2.7, 0.005, 8, 160),
          new T.MeshBasicMaterial({ color: 0xaa8cff, transparent: true, opacity: 0.32 })
        );
        ring2.rotation.set(-0.7, 0.35, -0.3);
        orbitGroup.add(ring2);

        // Refined floating gem nodes
        const nodes: THREE.Mesh[] = [];
        for (let i = 0; i < 7; i++) {
          const isAccent = i % 2 === 0;
          const nodeMesh = mesh(
            new T.OctahedronGeometry(isAccent ? 0.085 : 0.05, 0),
            new T.MeshStandardMaterial({
              color: isAccent ? 0xc8ff65 : 0xba9aff,
              metalness: 0.8,
              roughness: 0.2,
              emissive: isAccent ? 0x253810 : 0x221340,
            })
          );
          const angle = (i / 7) * Math.PI * 2;
          nodeMesh.position.set(
            Math.cos(angle) * (2.4 + (i % 3) * 0.15),
            Math.sin(angle) * (2.3 + (i % 2) * 0.15),
            Math.sin(angle * 2) * 0.6
          );
          orbitGroup.add(nodeMesh);
          nodes.push(nodeMesh);
        }

        // Particle field
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        let seed = 77;
        const rng = () => {
          seed = (seed * 1664525 + 1013904223) >>> 0;
          return seed / 4294967296;
        };

        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] = (rng() - 0.5) * 8.5;
          positions[i + 1] = (rng() - 0.5) * 8.5;
          positions[i + 2] = (rng() - 0.5) * 4.5 - 0.8;
        }

        const partGeo = new T.BufferGeometry();
        partGeo.setAttribute('position', new T.BufferAttribute(positions, 3));
        const partMat = new T.PointsMaterial({
          color: 0xc8ff65,
          size: 0.016,
          transparent: true,
          opacity: 0.45,
        });
        resources.push(partGeo, partMat);
        const particleField = new T.Points(partGeo, partMat);
        scene.add(particleField);

        let visible = true;
        let isDragging = false;
        let prevPointerX = 0;
        let prevPointerY = 0;
        let time = 0;
        let lastTimestamp = 0;

        const handleResize = () => {
          const w = container.clientWidth;
          const h = container.clientHeight;
          if (!w || !h) return;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
        handleResize();

        const intersectionObserver = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
        });
        intersectionObserver.observe(container);

        // Pointer controls with smooth lerping
        const onPointerDown = (e: PointerEvent) => {
          isDragging = true;
          prevPointerX = e.clientX;
          prevPointerY = e.clientY;
          canvas.setPointerCapture(e.pointerId);
        };

        const onPointerMove = (e: PointerEvent) => {
          if (!isDragging) {
            // Hover parallax
            const rect = container.getBoundingClientRect();
            const normX = (e.clientX - rect.left) / rect.width - 0.5;
            const normY = (e.clientY - rect.top) / rect.height - 0.5;
            targetRotation.current.y = normX * 0.45;
            targetRotation.current.x = -normY * 0.35;
            return;
          }
          const deltaX = e.clientX - prevPointerX;
          const deltaY = e.clientY - prevPointerY;
          prevPointerX = e.clientX;
          prevPointerY = e.clientY;
          targetRotation.current.y = Math.max(-0.6, Math.min(0.6, targetRotation.current.y + deltaX * 0.005));
          targetRotation.current.x = Math.max(-0.35, Math.min(0.35, targetRotation.current.x + deltaY * 0.004));
        };

        const onPointerUp = () => {
          isDragging = false;
        };

        const onPointerLeave = () => {
          if (!isDragging) {
            targetRotation.current.x = 0;
            targetRotation.current.y = 0;
          }
        };

        canvas.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        container.addEventListener('pointerleave', onPointerLeave);

        const animate = (now: number) => {
          if (disposed) return;
          frame = requestAnimationFrame(animate);

          const delta = Math.min((now - lastTimestamp) / 1000, 0.05);
          lastTimestamp = now;

          if (!visible || document.hidden) return;

          if (motionRef.current) {
            time += delta;
          }

          // Smooth spring lerp for fluid rotation
          const lerpFactor = 0.06;
          currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * lerpFactor;
          currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * lerpFactor;

          const idleX = motionRef.current ? Math.sin(time * 0.5) * 0.03 : 0;
          const idleY = motionRef.current ? Math.cos(time * 0.4) * 0.05 : 0;
          const idleFloat = motionRef.current ? Math.sin(time * 0.8) * 0.06 : 0;

          mainGroup.rotation.x = currentRotation.current.x + idleX;
          mainGroup.rotation.y = currentRotation.current.y + idleY;
          mainGroup.position.y = idleFloat;

          orbitGroup.rotation.z = motionRef.current ? time * 0.04 : 0;
          orbitGroup.rotation.y = currentRotation.current.y * 0.6;
          orbitGroup.rotation.x = currentRotation.current.x * 0.6;

          nodes.forEach((node, idx) => {
            node.rotation.x = time * 0.5 + idx;
            node.rotation.y = time * 0.4;
          });

          particleField.rotation.y = time * 0.012;

          renderer.render(scene, camera);
        };

        frame = requestAnimationFrame(animate);

        cleanup = () => {
          cancelAnimationFrame(frame);
          resizeObserver.disconnect();
          intersectionObserver.disconnect();
          canvas.removeEventListener('pointerdown', onPointerDown);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
          container.removeEventListener('pointerleave', onPointerLeave);
          resources.forEach(r => r.dispose());
          renderer.dispose();
          canvas.remove();
        };
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });

    return () => {
      disposed = true;
      cleanup();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="hero-stage">
      {/* Dynamic ambient backlights */}
      <div className="stage-glow stage-glow-lime" aria-hidden="true" />
      <div className="stage-glow stage-glow-violet" aria-hidden="true" />

      {/* Floating status badge at top */}
      <div className="hero-status-pill">
        <span className="status-ping">
          <span className="ping-ring" />
          <span className="ping-dot" />
        </span>
        <span>Available for projects & full-time roles</span>
      </div>

      {/* 3D Viewport container */}
      <div
        className="stage-viewport"
        ref={host}
        tabIndex={0}
        role="region"
        aria-label="Interactive 3D portrait of Kalhara. Move cursor or drag to rotate in 3D."
      >
        {(!ready || failed) && (
          <div className="scene-fallback">
            <Image
              src="/images/kalhara-avatar-3d.png"
              alt="Portrait of Nuwanandun Kalhara"
              width={1148}
              height={1370}
              priority
            />
          </div>
        )}
      </div>

      {/* Floating glass profile chip at bottom */}
      <div className="hero-profile-chip">
        <div className="chip-avatar">
          <Image
            src="/images/kalhara-profile.png"
            alt="Nuwanandun Kalhara"
            width={44}
            height={44}
            className="chip-avatar-img"
          />
        </div>
        <div className="chip-text">
          <strong>Nuwanandun Kalhara</strong>
          <span>Full Stack Developer · AI Research</span>
        </div>
        <div className="chip-location">
          <span>Sri Lanka</span>
        </div>
      </div>

      {/* Subtle interactive hint */}
      <div className="stage-hint" aria-hidden="true">
        <Move3d size={13} />
        <span>Interactive 3D · Hover or drag</span>
      </div>
    </div>
  );
}
