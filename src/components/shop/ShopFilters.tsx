"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, LayoutGrid, List, X } from "lucide-react";
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

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={onSearchSubmit} className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="h-11 w-full rounded-md border border-glass-border bg-glass-bg pl-10 pr-9 text-sm text-white placeholder:text-white/40 focus:border-gold/50 focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                updateParams({ search: undefined });
              }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2.5">
          <select
            value={activeSort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            aria-label="Sort products"
            className="h-11 rounded-md border border-glass-border bg-glass-bg px-3 text-sm text-white focus:border-gold/50 focus:outline-none [&>option]:bg-green-deep"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="hidden items-center rounded-md border border-glass-border p-0.5 sm:flex">
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
        "inline-flex h-9 w-9 items-center justify-center rounded-sm transition-colors",
        active ? "bg-gold/15 text-gold" : "text-white/50 hover:text-white",
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
        "rounded-full border px-3.5 py-1.5 text-[0.8rem] font-medium transition-all duration-200",
        active
          ? "border-gold bg-gold/15 text-gold"
          : "border-glass-border text-white/60 hover:border-white/30 hover:text-white",
      )}
    >
      {label}
    </button>
  );
}
