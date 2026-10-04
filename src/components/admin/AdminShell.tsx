"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
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
  BarChart3,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/classes";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

const STORAGE_KEY = "bah_admin_sidebar_collapsed";

interface AdminShellProps {
  admin: { email?: string; fullName: string | null };
  children: React.ReactNode;
}

function NavLinks({ showLabels }: { showLabels: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto sm:gap-1"
      aria-label="Admin navigation"
    >
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
              !showLabels && "justify-center px-2",
              active
                ? "bg-gold/15 text-gold"
                : "text-white/60 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            {showLabels && <span className="truncate">{link.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function AdminProfileMenu({
  admin,
}: {
  admin: { email?: string; fullName: string | null };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initial = (admin.fullName ?? admin.email ?? "A").charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onSignOut = async () => {
    setOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div ref={rootRef} className="relative z-[130]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={cn(
          "inline-flex items-center gap-2 rounded-md py-1 pl-1 pr-1.5 transition-colors",
          "hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
          open && "bg-white/5",
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-xs font-semibold text-gold sm:h-9 sm:w-9 sm:text-sm">
          {initial}
        </span>
        <span className="hidden min-w-0 text-left min-[480px]:block">
          <span className="block max-w-[9rem] truncate text-sm font-medium text-white sm:max-w-[12rem] lg:max-w-[14rem]">
            {admin.fullName ?? "Admin"}
          </span>
          {admin.email ? (
            <span className="block max-w-[9rem] truncate text-xs text-white/45 sm:max-w-[12rem] lg:max-w-[14rem]">
              {admin.email}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={cn(
            "hidden h-4 w-4 shrink-0 text-white/45 transition-transform min-[480px]:block",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[140] w-56 overflow-hidden rounded-lg border border-glass-border bg-black-2 py-1 shadow-2xl"
        >
          <div className="border-b border-glass-border px-3 py-2.5 min-[480px]:hidden">
            <p className="truncate text-sm font-medium text-white">
              {admin.fullName ?? "Admin"}
            </p>
            {admin.email ? (
              <p className="truncate text-xs text-white/45">{admin.email}</p>
            ) : null}
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={onSignOut}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
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

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

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

  return (
    <div
      className={cn(
        "grid h-dvh grid-cols-1 overflow-hidden transition-[grid-template-columns] duration-200",
        collapsed
          ? "md:grid-cols-[72px_minmax(0,1fr)]"
          : "md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]",
      )}
    >
      <aside className="hidden h-full min-h-0 flex-col border-r border-glass-border bg-black-2 p-3 md:flex lg:p-4">
        <div
          className={cn(
            "mb-4 shrink-0 px-1 lg:mb-6",
            collapsed && "flex justify-center px-0",
          )}
        >
          <Logo size="xs" href="/admin" showText={!collapsed} />
        </div>
        <NavLinks showLabels={!collapsed} />
        <div className="mt-auto flex shrink-0 flex-col gap-2 border-t border-glass-border pt-3 lg:gap-3 lg:pt-4">
          <Link
            href="/"
            title="View store"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/60 transition-colors hover:text-white",
              collapsed && "justify-center px-2",
            )}
          >
            <Store className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            {!collapsed && <span className="truncate">View Store</span>}
          </Link>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[120] md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(18rem,85vw)] flex-col border-r border-glass-border bg-black-2 p-4 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-3 px-0.5">
              <Logo size="xs" href="/admin" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/5 text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks showLabels />
            <div className="mt-auto flex flex-col gap-3 border-t border-glass-border pt-4">
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

      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
        <header className="relative z-[100] flex shrink-0 items-center justify-between gap-2 border-b border-glass-border bg-black-2/95 px-3 py-2.5 backdrop-blur-md sm:gap-4 sm:px-5 sm:py-3 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/5 text-white/70 hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={toggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-md text-white/70 hover:bg-white/5 hover:text-white md:inline-flex"
            >
              {collapsed ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
            <h1 className="truncate font-body text-base font-medium text-white sm:text-lg">
              {title}
            </h1>
          </div>

          <AdminProfileMenu admin={admin} />
        </header>

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
