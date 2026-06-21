"use client";

import { useCardTilt } from "@/hooks/useCardTilt";
import { useGeoMouseTrack, useHeroParallax } from "@/hooks/useHeroEffects";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import {
  useNavScroll,
  useSmoothScroll,
} from "@/hooks/useNavigation";
import {
  useScrollRevealGroup,
  useSectionGlow,
} from "@/hooks/useScrollReveal";

export default function ClientEffects() {
  useNavScroll();
  useSmoothScroll();
  useScrollRevealGroup(".reveal-up, .reveal-left, .reveal-right");
  useMagneticEffect();
  useCardTilt();
  useHeroParallax();
  useGeoMouseTrack();
  useSectionGlow();

  return null;
}
