"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/classes";

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hide = () => setHidden(true);

    window.addEventListener("load", () => {
      window.setTimeout(hide, 2200);
    });

    const failsafe = window.setTimeout(hide, 3500);

    return () => window.clearTimeout(failsafe);
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
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="[&_svg]:h-24 [&_svg]:w-24 [&_svg]:animate-loader-spin">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="60" cy="60" r="54" stroke="url(#lg1)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="60" cy="60" r="38" stroke="url(#lg2)" strokeWidth="0.5" opacity="0.6" />
            <path d="M60 6 L60 114 M6 60 L114 60" stroke="url(#lg1)" strokeWidth="0.5" />
            <path d="M60 6 Q90 30 114 60 Q90 90 60 114 Q30 90 6 60 Q30 30 60 6Z" stroke="#C9A84C" strokeWidth="0.8" fill="none" />
            <circle cx="60" cy="60" r="6" fill="#C9A84C" opacity="0.9" />
            <defs>
              <linearGradient id="lg1" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C9A84C" />
                <stop offset="1" stopColor="#1B6B47" />
              </linearGradient>
              <linearGradient id="lg2" x1="120" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1B6B47" />
                <stop offset="1" stopColor="#C9A84C" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p className="font-display text-[1.4rem] font-light uppercase tracking-[0.3em] text-gold">
          Bayt Al Hijama
        </p>
        <div className="h-0.5 w-[200px] overflow-hidden rounded-sm bg-white/10">
          <div className="h-full w-0 animate-loader-fill rounded-sm bg-grad-gold" />
        </div>
      </div>
    </div>
  );
}
