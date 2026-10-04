"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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

function observeRevealTargets(
  selector: string,
  observer: IntersectionObserver,
  seen: WeakSet<Element>,
) {
  document.querySelectorAll(selector).forEach((element) => {
    if (seen.has(element)) return;
    seen.add(element);
    observer.observe(element);
    if (isInViewport(element)) {
      revealElement(element, observer);
    }
  });
}

/**
 * Reveals `[data-reveal]` (etc.) elements as they enter the viewport.
 * Rebinds on every client navigation so remounted landing sections don't
 * stay stuck at opacity-0 after leaving and returning to the page.
 */
export function useScrollRevealGroup(
  selector: string,
  threshold = 0.12,
  rootMargin = "0px 0px -40px 0px",
) {
  const pathname = usePathname();

  useEffect(() => {
    const seen = new WeakSet<Element>();
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

    let scheduled = 0;
    const bind = () => observeRevealTargets(selector, observer, seen);
    const scheduleBind = () => {
      if (scheduled) return;
      scheduled = window.requestAnimationFrame(() => {
        scheduled = 0;
        bind();
      });
    };

    // Initial pass + delayed passes for Suspense / streaming content.
    bind();
    const t1 = window.setTimeout(scheduleBind, 100);
    const t2 = window.setTimeout(scheduleBind, 400);

    // Catch cards that mount after the route transition (e.g. ProductsSection).
    const mutationObserver = new MutationObserver(scheduleBind);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (scheduled) window.cancelAnimationFrame(scheduled);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname, selector, threshold, rootMargin]);
}

export function useSectionGlow() {
  const pathname = usePathname();

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
  }, [pathname]);
}
