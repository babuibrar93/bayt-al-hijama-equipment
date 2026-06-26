"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, LayoutGrid, List, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/classes";
import type { Category } from "@/types/db";
import type { ProductSort } from "@/lib/products";

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

interface ShopFiltersProps {
  categories: Category[];
  activeCategory?: string;
  activeSort: ProductSort;
  activeSearch: string;
  activeView: "grid" | "list";
}

export default function ShopFilters({
  categories,
  activeCategory,
  activeSort,
  activeSearch,
  activeView,
}: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(activeSearch);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      if (resetPage) params.delete("page");
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams],
  );

  const onSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateParams({ search: search.trim() || undefined });
  };

  const fieldClass =
    "h-10 rounded-lg border border-glass-border bg-black/20 text-sm text-white transition-colors focus:border-gold/45 focus:outline-none sm:h-11";

  return (
    <div
      className={cn(
        "relative mb-5 overflow-hidden rounded-xl border border-glass-border bg-glass-bg sm:mb-6",
        "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-[1] before:w-[3px] before:bg-gradient-to-b before:from-gold before:via-green-mid/70 before:to-transparent",
      )}
    >
      <div className="flex flex-col gap-3 border-b border-glass-border/50 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-3.5">
        <form
          onSubmit={onSearchSubmit}
          className="relative min-w-0 flex-1"
        >
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className={cn(fieldClass, "w-full pl-9 pr-9 placeholder:text-white/35")}
          />
          {search ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                updateParams({ search: undefined });
              }}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </form>

        <div className="flex items-center gap-2 sm:shrink-0">
          <div className="relative min-w-0 flex-1 sm:flex-none">
            <SlidersHorizontal
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35 sm:hidden"
              aria-hidden="true"
            />
            <select
              value={activeSort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              aria-label="Sort products"
              className={cn(
                fieldClass,
                "w-full appearance-none pl-3 pr-8 sm:min-w-[11.5rem] sm:pl-3",
              )}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div
            className="hidden items-center rounded-lg border border-glass-border bg-black/20 p-0.5 sm:flex"
            role="group"
            aria-label="Product view"
          >
            <ViewButton
              active={activeView === "grid"}
              onClick={() => updateParams({ view: undefined }, false)}
              label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </ViewButton>
            <ViewButton
              active={activeView === "list"}
              onClick={() => updateParams({ view: "list" }, false)}
              label="List view"
            >
              <List className="h-4 w-4" />
            </ViewButton>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="mb-2.5 flex items-center gap-2">
          <span className="h-px w-4 shrink-0 bg-gold/80" aria-hidden="true" />
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold sm:text-[0.68rem]">
            Categories
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterPill
            label="All"
            active={!activeCategory}
            onClick={() => updateParams({ category: undefined })}
          />
          {categories.map((category) => (
            <FilterPill
              key={category.id}
              label={category.name}
              active={activeCategory === category.slug}
              onClick={() => router.push(`/shop/category/${category.slug}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md transition-all duration-200",
        active
          ? "bg-gold/15 text-gold shadow-[inset_0_0_0_1px_rgba(201,168,76,0.25)]"
          : "text-white/45 hover:text-white/80",
      )}
    >
      {children}
    </button>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-[0.78rem] font-medium transition-all duration-200 sm:px-3.5 sm:text-[0.8125rem]",
        active
          ? "border-gold/40 bg-gold/12 text-gold shadow-[inset_0_0_0_1px_rgba(201,168,76,0.15)]"
          : "border-glass-border bg-black/15 text-white/55 hover:border-white/20 hover:bg-white/[0.03] hover:text-white/85",
      )}
    >
      {label}
    </button>
  );
}
