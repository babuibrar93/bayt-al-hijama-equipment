"use client";

import { useEffect } from "react";

const MAGNETIC_SELECTOR = "[data-magnetic]";

export function useMagneticEffect() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const buttons = document.querySelectorAll<HTMLElement>(MAGNETIC_SELECTOR);

    const handlers = Array.from(buttons).map((button) => {
      const onMouseMove = (event: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (event.clientX - cx) * 0.22;
        const dy = (event.clientY - cy) * 0.22;
        button.style.transform = `translate(${dx}px, ${dy}px)`;
      };

      const onMouseLeave = () => {
        button.style.transform = "";
        button.style.transition =
          "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
        window.setTimeout(() => {
          button.style.transition = "";
        }, 500);
      };

      button.addEventListener("mousemove", onMouseMove);
      button.addEventListener("mouseleave", onMouseLeave);

      return { button, onMouseMove, onMouseLeave };
    });

    return () => {
      handlers.forEach(({ button, onMouseMove, onMouseLeave }) => {
        button.removeEventListener("mousemove", onMouseMove);
        button.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, []);
}
