'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Code2, Sparkles, Terminal } from 'lucide-react';

export function HeroPortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform({
      rx: -y * 6,
      ry: x * 8,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ rx: 0, ry: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="hero-showcase"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rx}deg) rotateY(${transform.ry}deg)`,
      }}
    >
      {/* Dynamic ambient background glow pools */}
      <div className="showcase-glow showcase-glow-lime" aria-hidden="true" />
      <div className="showcase-glow showcase-glow-violet" aria-hidden="true" />

      

      {/* The Blended Portrait Frame */}
      <div className="portrait-canvas">
        <div className="portrait-image-wrapper">
          <Image
            src="/images/test2.jpg"
            alt="Nuwanandun Kalhara portrait"
            width={620}
            height={740}
            priority
            className="portrait-blended-img"
          />
          {/* Subtle gradient vignette blend */}
          <div className="portrait-vignette" />
        </div>

        {/* Ambient floating tech chips */}
        <div className="chip-badge chip-top-right">
          <Sparkles size={14} className="text-lime" />
          <span>Multimodal AI & ML</span>
        </div>

        <div className="chip-badge chip-bottom-left">
          <Terminal size={14} className="text-lime" />
          <span>Full-Stack Architecture</span>
        </div>
      </div>

      {/* Bottom Floating Identity Card */}
      <div className="showcase-identity-pill">
        <div className="identity-code-icon">
          <Code2 size={16} />
        </div>
        <div className="identity-info">
          <strong>Nuwanandun Kalhara</strong>
          <span>Software Engineering · KDU Final Year</span>
        </div>
        <span className="identity-tag">Sri Lanka</span>
      </div>
    </div>
  );
}
