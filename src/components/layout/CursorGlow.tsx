"use client";

import { useCursorGlow } from "@/hooks/useCursorGlow";

export default function CursorGlow() {
  const glowRef = useCursorGlow();

  return <div className="cursor-glow" id="cursorGlow" ref={glowRef} aria-hidden="true" />;
}
