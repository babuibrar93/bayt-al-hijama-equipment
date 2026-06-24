"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User } from "lucide-react";
import { NAV_LINKS } from "@/constants/navigation";
import { SITE } from "@/constants/site";
import { useCart } from "@/context/CartContext";
import { cn, navLink } from "@/lib/classes";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { itemCount, isHydrated } = useCart();

  const isHome = pathname === "/";

  // Section anchors smooth-scroll on the homepage; elsewhere they jump home.
  const sectionHref = (hash: string) => (isHome ? hash : `/${hash}`);

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
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label={`${SITE.name} home`}
        >
          <span className="text-[1.4rem] leading-none text-gold" aria-hidden="true">
            ⬡
          </span>
          <span className="font-display text-[1.2rem] font-semibold tracking-[0.03em] text-white">
            {SITE.shortName}
          </span>
        </Link>

        <ul className="mx-auto hidden items-center gap-9 lg:flex" role="list">
          <li>
            <Link href="/shop" className={navLink}>
              Shop
            </Link>
          </li>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={sectionHref(link.href)} className={navLink}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 items-center gap-5 lg:flex">
          <Link
            href="/account"
            aria-label="My account"
            className="inline-flex items-center justify-center rounded-full p-2 text-white/80 transition-colors hover:text-gold"
          >
            <User className="h-5 w-5" aria-hidden="true" />
          </Link>
          <CartLink itemCount={itemCount} isHydrated={isHydrated} />
          <Link
            href="/shop"
            data-magnetic
            className="rounded-sm bg-green-mid px-[22px] py-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-white transition-all duration-[250ms] hover:-translate-y-px hover:bg-green-light"
          >
            Shop Now
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-4 lg:hidden">
          <CartLink itemCount={itemCount} isHydrated={isHydrated} />
          <button
            type="button"
            id="hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex flex-col gap-[5px] p-1"
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
        </div>
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
          <li>
            <Link
              href="/shop"
              className="font-display text-[2.2rem] font-normal text-white/80 transition-colors hover:text-gold"
              onClick={closeMenu}
            >
              Shop
            </Link>
          </li>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={sectionHref(link.href)}
                className="font-display text-[2.2rem] font-normal text-white/80 transition-colors hover:text-gold"
                onClick={closeMenu}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/account"
              className="font-display text-[2.2rem] font-normal text-white/80 transition-colors hover:text-gold"
              onClick={closeMenu}
            >
              Account
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="font-display text-[2.2rem] font-normal text-gold transition-colors"
              onClick={closeMenu}
            >
              View Cart
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

function CartLink({
  itemCount,
  isHydrated,
}: {
  itemCount: number;
  isHydrated: boolean;
}) {
  return (
    <Link
      href="/cart"
      aria-label={`Cart${isHydrated && itemCount > 0 ? `, ${itemCount} items` : ""}`}
      className="relative inline-flex items-center justify-center rounded-full p-2 text-white/80 transition-colors hover:text-gold"
    >
      <ShoppingBag className="h-5 w-5" aria-hidden="true" />
      {isHydrated && itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[0.65rem] font-bold leading-none text-black">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
