import React, { useRef, useState } from 'react';

/**
 * TiltCard3D — Wraps any card with interactive 3D depth, rotation tilt,
 * glare reflection, and layer elevation on hover.
 */
const TiltCard3D = ({
  children,
  className = '',
  maxRotation = 14,
  scale = 1.02,
  glare = true,
  onClick,
}) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
  });
  const [glareStyle, setGlareStyle] = useState({
    opacity: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 0%, transparent 60%)',
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    const rotX = ((y - 0.5) * -2 * maxRotation).toFixed(2);
    const rotY = ((x - 0.5) * 2 * maxRotation).toFixed(2);

    setStyle({
      transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 0.08s ease-out',
    });

    if (glare) {
      setGlareStyle({
        opacity: 0.35,
        background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 45%, transparent 70%)`,
        transition: 'opacity 0.2s ease',
      });
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
    });
    if (glare) {
      setGlareStyle((prev) => ({
        ...prev,
        opacity: 0,
        transition: 'opacity 0.4s ease',
      }));
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
      className={`relative preserve-3d cursor-pointer ${className}`}
    >
      {/* Glare sheen overlay */}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl z-30 overflow-hidden mix-blend-overlay"
          style={glareStyle}
        />
      )}
      {children}
    </div>
  );
};

export default TiltCard3D;
