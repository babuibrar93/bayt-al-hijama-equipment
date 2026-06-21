"use client";

import { useEffect } from "react";

const TILT_SELECTOR = ".product-card, .trust__card, .cat-card";

export function useCardTilt() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = document.querySelectorAll<HTMLElement>(TILT_SELECTOR);

    const handlers = Array.from(cards).map((card) => {
      const onMouseMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
      };

      const onMouseLeave = () => {
        card.style.transform = "";
        card.style.transition =
          "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
        window.setTimeout(() => {
          card.style.transition = "";
        }, 600);
      };

      card.addEventListener("mousemove", onMouseMove);
      card.addEventListener("mouseleave", onMouseLeave);

      return { card, onMouseMove, onMouseLeave };
    });

    return () => {
      handlers.forEach(({ card, onMouseMove, onMouseLeave }) => {
        card.removeEventListener("mousemove", onMouseMove);
        card.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, []);
}
