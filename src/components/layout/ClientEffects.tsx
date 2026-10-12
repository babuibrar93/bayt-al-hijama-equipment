"use client";

import { useEffect } from "react";
import { useCardTilt } from "@/hooks/useCardTilt";
import { useGeoMouseTrack, useHeroParallax } from "@/hooks/useHeroEffects";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { useAfterLoad } from "@/hooks/useAfterLoad";
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

/** Pointer effects and logo motion wait until after load so they miss LCP. */
function DeferredEffects() {
  const ready = useAfterLoad();

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.add("effects-ready");
    return () => document.documentElement.classList.remove("effects-ready");
  }, [ready]);

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
