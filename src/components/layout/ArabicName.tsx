"use client";

import { useEffect, useRef, useState } from "react";

/** Loads the Urdu face only when the footer is about to enter view. */
export default function ArabicName({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className={
        ready
          ? "font-urdu text-[1.1rem] text-gold/70"
          : "font-serif text-[1.1rem] text-gold/70"
      }
      lang="ar"
      dir="rtl"
    >
      {children}
    </p>
  );
}
