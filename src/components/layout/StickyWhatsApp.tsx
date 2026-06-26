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
      id="stickyWA"
      data-magnetic
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 overflow-visible rounded-lg bg-whatsapp px-5 py-3.5 text-[0.82rem] font-bold tracking-[0.04em] text-white shadow-[0_8px_32px_rgba(37,211,102,0.4)] transition-all duration-300 ease-spring hover:-translate-y-[3px] hover:scale-[1.06] hover:shadow-[0_12px_40px_rgba(37,211,102,0.55)] max-sm:bottom-6 max-sm:right-5 max-sm:px-4 max-sm:py-3"
    >
      <div
        className="absolute -inset-1.5 animate-wa-pulse rounded-lg bg-[rgba(37,211,102,0.25)]"
        aria-hidden="true"
      />
      <WhatsAppIcon size={26} />
      <span>Order Now</span>
    </a>
  );
}
