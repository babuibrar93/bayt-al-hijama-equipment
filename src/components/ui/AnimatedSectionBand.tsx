"use client";

import { useEffect, useState, type ReactNode } from "react";
import Particles from "@/components/ui/Particles";

interface AnimatedSectionBandProps {
  id: string;
  children: ReactNode;
}

export default function AnimatedSectionBand({ id, children }: AnimatedSectionBandProps) {
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
