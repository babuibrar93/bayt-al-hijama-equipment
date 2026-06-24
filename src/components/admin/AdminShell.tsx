"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  Store,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/classes";
import SignOutButton from "@/components/auth/SignOutButton";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
];

const STORAGE_KEY = "bah_admin_sidebar_collapsed";

interface AdminShellProps {
  admin: { email?: string; fullName: string | null };
  children: React.ReactNode;
}

export default function AdminShell({ admin, children }: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleCollapse = () => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  const activeLink = LINKS.find((l) =>
    l.exact ? pathname === l.href : pathname.startsWith(l.href),
  );
  const title = activeLink?.label ?? "Admin";

  const NavLinks = ({ showLabels }: { showLabels: boolean }) => (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin navigation">
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            title={!showLabels ? link.label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              !showLabels && "justify-center",
              active
                ? "bg-gold/15 text-gold"
                : "text-white/60 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            {showLabels && link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div
      className={cn(
        "grid min-h-screen grid-cols-1 transition-[grid-template-columns] duration-200",
        collapsed ? "md:grid-cols-[76px_1fr]" : "md:grid-cols-[240px_1fr]",
      )}
    >
      {/* Desktop sidebar */}
      <aside className="hidden flex-col border-r border-glass-border bg-black-2 p-4 md:flex">
        <Link
          href="/admin"
          className={cn(
            "mb-6 flex items-center gap-2.5 px-1.5",
            collapsed && "justify-center px-0",
          )}
        >
          <span className="text-[1.4rem] leading-none text-gold" aria-hidden="true">
            ⬡
          </span>
          {!collapsed && (
            <span className="font-display text-lg font-semibold text-white">
              Admin
            </span>
          )}
        </Link>
        <NavLinks showLabels={!collapsed} />
        <div className="mt-auto flex flex-col gap-3 border-t border-glass-border pt-4">
          <Link
            href="/"
            title="View store"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/60 transition-colors hover:text-white",
              collapsed && "justify-center",
            )}
          >
            <Store className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            {!collapsed && "View Store"}
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[120] md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-glass-border bg-black-2 p-4">
            <div className="mb-6 flex items-center justify-between px-1.5">
              <span className="font-display text-lg font-semibold text-white">
                Admin
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks showLabels />
            <div className="mt-auto border-t border-glass-border pt-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/60 hover:text-white"
              >
                <Store className="h-[18px] w-[18px]" aria-hidden="true" />
                View Store
              </Link>
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-[100] flex items-center justify-between gap-4 border-b border-glass-border bg-black-2/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="text-white/70 hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={toggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden text-white/70 hover:text-white md:inline-flex"
            >
              {collapsed ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
            <h1 className="font-display text-lg font-medium text-white">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-white">
                {admin.fullName ?? "Admin"}
              </p>
              {admin.email && (
                <p className="text-xs text-white/45">{admin.email}</p>
              )}
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-sm font-semibold text-gold">
              {(admin.fullName ?? admin.email ?? "A").charAt(0).toUpperCase()}
            </div>
            <SignOutButton className="hidden sm:inline-flex" />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
