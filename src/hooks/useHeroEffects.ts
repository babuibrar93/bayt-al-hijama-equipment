"use client";

import { useEffect } from "react";

export function useHeroParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const visual = document.querySelector<HTMLElement>("[data-hero-visual]");
    const geos = document.querySelectorAll<HTMLElement>("[data-hero-geo]");
    const hero = document.getElementById("hero");
    if (!visual || !hero) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight || window.innerHeight;

        if (scrollY <= heroHeight) {
          const progress = scrollY / heroHeight;
          visual.style.transform = `translateY(${progress * 60}px)`;
          geos.forEach((geo, index) => {
            geo.style.transform = `translateY(${progress * (30 + index * 15)}px)`;
          });
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

export function useGeoMouseTrack() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const hero = document.getElementById("hero");
    const geos = document.querySelectorAll<HTMLElement>("[data-hero-geo]");
    if (!hero || !geos.length) return;

    const onMouseMove = (event: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const x = (event.clientX - rect.left - cx) / cx;
      const y = (event.clientY - rect.top - cy) / cy;

      geos.forEach((geo, index) => {
        const depth = (index + 1) * 8;
        geo.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    };

    const onMouseLeave = () => {
      geos.forEach((geo) => {
        geo.style.transform = "";
      });
    };

    hero.addEventListener("mousemove", onMouseMove);
    hero.addEventListener("mouseleave", onMouseLeave);

    return () => {
      hero.removeEventListener("mousemove", onMouseMove);
      hero.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);
}
