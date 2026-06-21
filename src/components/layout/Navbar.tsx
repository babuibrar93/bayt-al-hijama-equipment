"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/constants/navigation";
import { SITE } from "@/constants/site";
import { WHATSAPP } from "@/constants/whatsapp";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="nav" id="nav" role="navigation" aria-label="Main navigation">
        <a href="#hero" className="nav__brand" aria-label={`${SITE.name} home`}>
          <span className="nav__brand-icon" aria-hidden="true">
            ⬡
          </span>
          <span className="nav__brand-text">{SITE.shortName}</span>
        </a>

        <ul className="nav__links" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav__link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={WHATSAPP.nav}
          className="nav__cta"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order via WhatsApp"
        >
          Order via WhatsApp
        </a>

        <button
          type="button"
          className={`nav__hamburger${menuOpen ? " open" : ""}`}
          id="hamburger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobileMenu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        id="mobileMenu"
        role="dialog"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <ul role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="mobile-menu__link" onClick={closeMenu}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={WHATSAPP.mobile}
              className="mobile-menu__link mobile-menu__link--cta"
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
