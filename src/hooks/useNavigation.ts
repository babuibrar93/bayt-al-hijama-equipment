"use client";

import { useEffect } from "react";
import { scrollToSection } from "@/utils";

export function useSmoothScroll() {
  useEffect(() => {
    const anchors = document.querySelectorAll<HTMLAnchorElement>(
      'a[href^="#"]',
    );

    const handlers = Array.from(anchors).map((anchor) => {
      const onClick = (event: MouseEvent) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        scrollToSection(href);
      };

      anchor.addEventListener("click", onClick);
      return { anchor, onClick };
    });

    return () => {
      handlers.forEach(({ anchor, onClick }) => {
        anchor.removeEventListener("click", onClick);
      });
    };
  }, []);
}
