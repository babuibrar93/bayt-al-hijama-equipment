"use client";

import { useCursorGlow } from "@/hooks/useCursorGlow";

export default function CursorGlow() {
  const glowRef = useCursorGlow();

  return (
    <div
      id="cursorGlow"
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(27,107,71,0.12)_0%,transparent_70%)] opacity-0"
    />
  );
}
