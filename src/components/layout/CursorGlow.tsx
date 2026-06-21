"use client";

import { useCursorGlow } from "@/hooks/useCursorGlow";

export default function CursorGlow() {
  const glowRef = useCursorGlow();

  return (
    <div
      id="cursorGlow"
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(27,107,71,0.12)_0%,transparent_70%)] transition-transform duration-[80ms] linear will-change-transform"
    />
  );
}
