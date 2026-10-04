"use client";

import { useEffect, useState } from "react";
import { useCardTilt } from "@/hooks/useCardTilt";
import { useGeoMouseTrack, useHeroParallax } from "@/hooks/useHeroEffects";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { useSmoothScroll } from "@/hooks/useNavigation";
import {
  useScrollRevealGroup,
  useSectionGlow,
} from "@/hooks/useScrollReveal";

export default function ClientEffects() {
  useSmoothScroll();
  useScrollRevealGroup("[data-reveal]");

  return <DeferredEffects />;
}

/** Pointer effects wait until the browser is idle so they miss the load window. */
function DeferredEffects() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hasIdle = typeof window.requestIdleCallback === "function";
    const id = hasIdle
      ? window.requestIdleCallback(() => setReady(true), { timeout: 2500 })
      : window.setTimeout(() => setReady(true), 1200);

    return () => {
      if (hasIdle && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(id as number);
      } else {
        window.clearTimeout(id as number);
      }
    };
  }, []);

  if (!ready) return null;
  return <IdleEffects />;
}

function IdleEffects() {
  useMagneticEffect();
  useCardTilt();
  useHeroParallax();
  useGeoMouseTrack();
  useSectionGlow();
  return null;
}
