"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/classes";

const SESSION_KEY = "bah_intro_shown";
const INTRO_MS = 650;

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";

    if (prefersReducedMotion || alreadyShown) {
      setHidden(true);
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");
    const timer = window.setTimeout(() => setHidden(true), INTRO_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      id="loader"
      aria-hidden={hidden}
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-[opacity,visibility] duration-[600ms] ease-out",
        hidden && "pointer-events-none invisible opacity-0",
      )}
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <Logo size="lg" href={null} priority />
        <div className="h-0.5 w-[180px] overflow-hidden rounded-sm bg-white/10">
          <div className="h-full w-0 animate-loader-fill rounded-sm bg-grad-gold" />
        </div>
      </div>
    </div>
  );
}
