"use client";

import { useEffect, useState } from "react";

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
    <div className={`loader${hidden ? " hidden" : ""}`} id="loader" aria-hidden={hidden}>
      <div className="loader__inner">
        <div className="loader__arabesque">
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
        <p className="loader__text">Bayt Al Hijama</p>
        <div className="loader__bar">
          <div className="loader__fill" />
        </div>
      </div>
    </div>
  );
}
