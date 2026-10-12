"use client";

import type { ReactNode } from "react";
import Particles from "@/components/ui/Particles";
import { useAfterLoad } from "@/hooks/useAfterLoad";

interface AnimatedSectionBandProps {
  id: string;
  children: ReactNode;
}

export default function AnimatedSectionBand({ id, children }: AnimatedSectionBandProps) {
  const ready = useAfterLoad();

  return (
    <div className="relative overflow-hidden bg-black-2">
      <div
        className="pointer-events-none absolute inset-0 bg-cta-bg bg-black-2"
        aria-hidden="true"
      />
      {ready ? (
        <Particles
          id={id}
          options={{ count: 12, goldRatio: 0.45, minDur: 5, maxDur: 12 }}
        />
      ) : null}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
