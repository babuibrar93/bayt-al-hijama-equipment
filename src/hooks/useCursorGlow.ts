"use client";

import { useEffect, useRef } from "react";

export function useCursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glow = glowRef.current;
    if (!glow) return;

    let frame = 0;
    let running = false;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;

    const paint = () => {
      glow.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      paint();

      if (Math.abs(mx - cx) < 0.6 && Math.abs(my - cy) < 0.6) {
        running = false;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    const onMouseMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
      glow.style.opacity = "1";
      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return glowRef;
}
