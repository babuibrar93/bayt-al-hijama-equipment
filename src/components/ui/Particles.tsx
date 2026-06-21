"use client";

import { useEffect, useRef } from "react";
import type { ParticleOptions } from "@/types";
import { cn } from "@/lib/classes";

interface ParticlesProps {
  id: string;
  options: ParticleOptions;
  className?: string;
}

export default function Particles({ id, options, className }: ParticlesProps) {
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

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("div");
      particle.className =
        "pointer-events-none absolute rounded-full animate-particle-rise";

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
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      });

      fragment.appendChild(particle);
    }

    container.appendChild(fragment);

    return () => {
      container.innerHTML = "";
    };
  }, [options]);

  return (
    <div
      ref={containerRef}
      id={id}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    />
  );
}
