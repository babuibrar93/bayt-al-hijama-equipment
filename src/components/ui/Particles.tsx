"use client";

import { useEffect, useRef } from "react";
import type { ParticleOptions } from "@/types";

interface ParticlesProps {
  id: string;
  options: ParticleOptions;
}

export default function Particles({ id, options }: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const {
      count,
      goldRatio = 0.4,
      minSize = 1,
      maxSize = 3,
      minDur = 6,
      maxDur = 16,
    } = options;

    const styleId = `particle-keyframes-${id}`;
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes particleRise {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10%  { opacity: 1; }
          50%  { transform: translateY(-120px) translateX(20px) scale(1.2); }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-240px) translateX(0) scale(0.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("div");
      particle.className = "particle";

      const isGold = Math.random() < goldRatio;
      const size = minSize + Math.random() * (maxSize - minSize);
      const duration = minDur + Math.random() * (maxDur - minDur);
      const delay = Math.random() * -duration;
      const color = isGold
        ? `rgba(201, 168, 76, ${0.2 + Math.random() * 0.5})`
        : `rgba(27, 107, 71, ${0.2 + Math.random() * 0.4})`;

      Object.assign(particle.style, {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        animationName: "particleRise",
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
      });

      fragment.appendChild(particle);
    }

    container.appendChild(fragment);

    return () => {
      container.innerHTML = "";
    };
  }, [id, options]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={id === "heroParticles" ? "hero__particles" : "cta-section__particles"}
      aria-hidden="true"
    />
  );
}
