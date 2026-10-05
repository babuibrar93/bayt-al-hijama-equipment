"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  User,
  type LucideIcon,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { NAV_LINKS } from "@/constants/navigation";
import { useCart } from "@/context/CartContext";
import { cn, navLink, pageGutter } from "@/lib/classes";

const navIconClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-mid text-white transition-colors hover:bg-green-light";

const mobileLinkClass =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] font-medium text-white transition-colors hover:bg-white/5 hover:text-gold active:bg-white/8 sm:text-base";

const mobileIconWrap =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-mid text-white";

const NAV_ICONS: Record<string, LucideIcon> = {
  "#products": Package,
  "#why": ShieldCheck,
  "#categories": LayoutGrid,
  "#testimonials": Star,
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { itemCount, isHydrated } = useCart();

  const isHome = pathname === "/";
  const sectionHref = (hash: string) => (isHome ? hash : `/${hash}`);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
          "fixed inset-x-0 top-0 z-[100] flex h-nav items-center gap-4 border-b transition-all duration-300 ease-out lg:gap-6",
          pageGutter,
          scrolled
            ? "border-glass-border bg-[rgba(5,12,8,0.94)] shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
            : "border-transparent bg-[rgba(5,12,8,0.88)]",
        )}
      >
        <Logo size="sm" priority={pathname !== "/"} className="min-w-0" />

        <ul className="mx-auto hidden items-center gap-7 lg:flex" role="list">
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

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <Link
            href="/account"
            aria-label="My account"
            className={navIconClass}
          >
            <User className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>
          <CartLink itemCount={itemCount} isHydrated={isHydrated} />
          <Link
            href="/shop"
            data-magnetic
            className="rounded-sm bg-green-mid px-5 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-white transition-all duration-[250ms] hover:-translate-y-px hover:bg-green-light"
          >
            Shop Now
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-3 lg:hidden">
          <CartLink itemCount={itemCount} isHydrated={isHydrated} />
          <button
            type="button"
            id="hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full bg-green-mid text-white"
          >
            <span
              className={cn(
                "block h-[1.5px] w-[18px] rounded-sm bg-white transition-all duration-300 ease-out",
                menuOpen && "translate-y-[6.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-[1.5px] w-[18px] rounded-sm bg-white transition-all duration-300 ease-out",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-[1.5px] w-[18px] rounded-sm bg-white transition-all duration-300 ease-out",
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
          "fixed inset-0 z-[99] flex flex-col bg-[rgba(5,12,8,0.98)] backdrop-blur-[20px] transition-all duration-[400ms] ease-out lg:hidden",
          pageGutter,
          menuOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
      >
        <ul
          className="mx-auto flex w-full max-w-sm flex-col gap-1.5 pt-[calc(theme(spacing.nav)+1.25rem)]"
          role="list"
        >
          <li>
            <Link href="/shop" className={mobileLinkClass} onClick={closeMenu}>
              <span className={mobileIconWrap}>
                <Store className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </span>
              Shop
            </Link>
          </li>
          {NAV_LINKS.map((link) => {
            const Icon = NAV_ICONS[link.href] ?? Package;
            return (
              <li key={link.href}>
                <a
                  href={sectionHref(link.href)}
                  className={mobileLinkClass}
                  onClick={closeMenu}
                >
                  <span className={mobileIconWrap}>
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </span>
                  {link.label}
                </a>
              </li>
            );
          })}
          <li>
            <Link
              href="/account"
              className={mobileLinkClass}
              onClick={closeMenu}
            >
              <span className={mobileIconWrap}>
                <User className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </span>
              Account
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className={cn(mobileLinkClass, "text-gold hover:text-gold")}
              onClick={closeMenu}
            >
              <span className={mobileIconWrap}>
                <ShoppingBag
                  className="h-4 w-4"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
              View Cart
              {isHydrated && itemCount > 0 ? (
                <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[0.7rem] font-bold text-black">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
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
      className={cn(navIconClass, "relative")}
    >
      <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" />
      {isHydrated && itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[0.65rem] font-bold leading-none text-black">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
