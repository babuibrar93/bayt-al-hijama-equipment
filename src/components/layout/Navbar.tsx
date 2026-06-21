"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/constants/navigation";
import { SITE } from "@/constants/site";
import { WHATSAPP } from "@/constants/whatsapp";
import { cn, navLink } from "@/lib/classes";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        id="nav"
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          "fixed inset-x-0 top-0 z-[100] flex h-nav items-center gap-10 px-10 transition-all duration-[400ms] ease-out max-md:px-6 max-lg:gap-6",
          scrolled &&
            "border-b border-glass-border bg-[rgba(5,12,8,0.92)] backdrop-blur-[20px]",
        )}
      >
        <a
          href="#hero"
          className="flex shrink-0 items-center gap-2.5"
          aria-label={`${SITE.name} home`}
        >
          <span className="text-[1.4rem] leading-none text-gold" aria-hidden="true">
            ⬡
          </span>
          <span className="font-display text-[1.2rem] font-semibold tracking-[0.03em] text-white">
            {SITE.shortName}
          </span>
        </a>

        <ul className="mx-auto hidden items-center gap-9 lg:flex" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={navLink}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={WHATSAPP.nav}
          data-magnetic
          className="hidden shrink-0 rounded-sm bg-green-mid px-[22px] py-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-white transition-all duration-[250ms] hover:-translate-y-px hover:bg-green-light lg:inline-flex"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order via WhatsApp"
        >
          Order via WhatsApp
        </a>

        <button
          type="button"
          id="hamburger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobileMenu"
          onClick={() => setMenuOpen((open) => !open)}
          className="ml-auto flex flex-col gap-[5px] p-1 lg:hidden"
        >
          <span
            className={cn(
              "block h-[1.5px] w-[22px] rounded-sm bg-white transition-all duration-300 ease-out",
              menuOpen && "translate-y-[6.5px] rotate-45",
            )}
          />
          <span
            className={cn(
              "block h-[1.5px] w-[22px] rounded-sm bg-white transition-all duration-300 ease-out",
              menuOpen && "opacity-0",
            )}
          />
          <span
            className={cn(
              "block h-[1.5px] w-[22px] rounded-sm bg-white transition-all duration-300 ease-out",
              menuOpen && "-translate-y-[6.5px] -rotate-45",
            )}
          />
        </button>
      </nav>

      <div
        id="mobileMenu"
        role="dialog"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={cn(
          "fixed inset-0 z-[99] flex items-center justify-center bg-[rgba(5,12,8,0.98)] backdrop-blur-[20px] transition-all duration-[400ms] ease-out lg:hidden",
          menuOpen
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none",
        )}
      >
        <ul className="flex flex-col items-center gap-8" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-display text-[2.2rem] font-normal text-white/80 transition-colors hover:text-gold"
                onClick={closeMenu}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={WHATSAPP.mobile}
              className="font-display text-[2.2rem] font-normal text-gold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              WhatsApp Order
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
