"use client";

import dynamic from "next/dynamic";
import type { ParticleOptions } from "@/types";
import { useAfterLoad } from "@/hooks/useAfterLoad";

const Particles = dynamic(() => import("@/components/ui/Particles"), {
  ssr: false,
});

/** Decorative particles mount after load so they miss the LCP window. */
export default function IdleParticles({
  id,
  options,
}: {
  id: string;
  options: ParticleOptions;
}) {
  const ready = useAfterLoad();
  if (!ready) return null;
  return <Particles id={id} options={options} />;
}
