"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { NAV_LINKS } from "@/constants/navigation";
import { useCart } from "@/context/CartContext";
import { cn, navLink } from "@/lib/classes";

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
          "fixed inset-x-0 top-0 z-[100] flex h-nav items-center gap-6 border-b px-6 transition-all duration-300 ease-out lg:px-8",
          scrolled
            ? "border-glass-border bg-[rgba(5,12,8,0.94)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            : "border-transparent bg-[rgba(5,12,8,0.55)] backdrop-blur-md",
        )}
      >
        <Logo size="sm" priority />

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
            className="inline-flex items-center justify-center rounded-full p-2 text-white/75 transition-colors hover:text-gold"
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
            : "pointer-events-none invisible opacity-0",
        )}
      >
        <ul className="flex flex-col items-center gap-6" role="list">
          <li>
            <Link
              href="/shop"
              className="font-body text-[1.75rem] font-medium text-white/80 transition-colors hover:text-gold"
              onClick={closeMenu}
            >
              Shop
            </Link>
          </li>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={sectionHref(link.href)}
                className="font-body text-[1.75rem] font-medium text-white/80 transition-colors hover:text-gold"
                onClick={closeMenu}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/account"
              className="font-body text-[1.75rem] font-medium text-white/80 transition-colors hover:text-gold"
              onClick={closeMenu}
            >
              Account
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="font-body text-[1.75rem] font-medium text-gold transition-colors"
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
      className="relative inline-flex items-center justify-center rounded-full p-2 text-white/75 transition-colors hover:text-gold"
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
