"use client";

import { useEffect, useRef } from "react";
import { WHATSAPP } from "@/constants/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function StickyWhatsApp() {
  const waRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const wa = waRef.current;
    const hero = document.getElementById("hero");
    if (!wa || !hero) return;

    wa.style.transition = "opacity 0.4s ease";

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        wa.style.opacity = visible ? "0" : "1";
        wa.style.pointerEvents = visible ? "none" : "auto";
      },
      { threshold: 0.3 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      ref={waRef}
      href={WHATSAPP.sticky}
      className="sticky-wa"
      id="stickyWA"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <div className="sticky-wa__pulse" aria-hidden="true" />
      <WhatsAppIcon size={26} />
      <span className="sticky-wa__label">Order Now</span>
    </a>
  );
}
