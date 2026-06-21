"use client";

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
  useMagneticEffect();
  useCardTilt();
  useHeroParallax();
  useGeoMouseTrack();
  useSectionGlow();

  return null;
}
