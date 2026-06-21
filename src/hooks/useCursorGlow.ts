"use client";

import { useEffect, useRef } from "react";

export function useCursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const glow = glowRef.current;
    if (!glow) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let frameId = 0;

    const onMouseMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
    };

    const animate = () => {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      glow.style.left = `${cx}px`;
      glow.style.top = `${cy}px`;
      frameId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    frameId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return glowRef;
}
