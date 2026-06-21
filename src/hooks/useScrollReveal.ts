"use client";

import { useEffect } from "react";

function revealElement(
  element: Element,
  observer: IntersectionObserver,
) {
  element.classList.add("is-visible");
  observer.unobserve(element);
}

function isInViewport(element: Element) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export function useScrollRevealGroup(
  selector: string,
  threshold = 0.12,
  rootMargin = "0px 0px -40px 0px",
) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target, observer);
          }
        });
      },
      { threshold, rootMargin },
    );

    elements.forEach((element) => {
      observer.observe(element);
      if (isInViewport(element)) {
        revealElement(element, observer);
      }
    });

    return () => observer.disconnect();
  }, [selector, threshold, rootMargin]);
}

export function useSectionGlow() {
  useEffect(() => {
    const sections = document.querySelectorAll("[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.setProperty(
              "--entry-glow",
              "1",
            );
          }
        });
      },
      { threshold: 0.1 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
}
