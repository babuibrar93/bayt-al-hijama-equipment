"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ParticleOptions } from "@/types";

const Particles = dynamic(() => import("@/components/ui/Particles"), {
  ssr: false,
});

/** Decorative particles mount after first paint so they miss the LCP window. */
export default function IdleParticles({
  id,
  options,
}: {
  id: string;
  options: ParticleOptions;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle
      ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
      : window.setTimeout(() => setReady(true), 1200);

    return () => {
      if (hasIdle && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(handle as number);
      } else {
        window.clearTimeout(handle as number);
      }
    };
  }, []);

  if (!ready) return null;
  return <Particles id={id} options={options} />;
}
