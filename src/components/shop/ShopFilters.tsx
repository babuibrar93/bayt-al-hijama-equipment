"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Select } from "@/components/ui";
import { cn, typeBodySm, typeEyebrow, typeMeta } from "@/lib/classes";
import type { Category } from "@/types/db";
import type { ProductSort } from "@/lib/products";

function listingHref(
  pathname: string,
  search: string,
  sort: ProductSort,
) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (sort !== "newest") params.set("sort", sort);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

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
}

export default function ShopFilters({
  categories,
  activeCategory,
  activeSort,
  activeSearch,
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

  const fieldClass = cn(
    "h-10 rounded-lg border border-glass-border bg-black/20 text-white transition-colors focus:border-gold/45 focus:outline-none sm:h-11",
    typeBodySm,
  );

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
          className="relative w-full max-w-md min-w-0"
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
            className={cn(
              fieldClass,
              "w-full pl-9 pr-9 placeholder:text-white/35",
            )}
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

        <div className="w-full sm:w-auto sm:min-w-[13.5rem] sm:shrink-0">
          <Select
            options={SORT_OPTIONS}
            value={activeSort}
            onChange={(value) =>
              updateParams({
                sort: value === "newest" ? undefined : value,
              })
            }
            placeholder="Sort by"
            searchable={false}
            containerClassName="w-full"
          />
        </div>
      </div>

      <div className="px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="mb-2.5 flex items-center gap-2">
          <span className="h-px w-4 shrink-0 bg-gold/80" aria-hidden="true" />
          <span
            className={cn(
              "font-semibold uppercase tracking-[0.14em] text-gold",
              typeEyebrow,
            )}
          >
            Categories
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterPill
            href={listingHref("/shop", activeSearch, activeSort)}
            label="All"
            active={!activeCategory}
          />
          {categories.map((category) => (
            <FilterPill
              key={category.id}
              href={`/shop/category/${category.slug}`}
              label={category.name}
              active={activeCategory === category.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-12 items-center rounded-lg border px-4 font-medium transition-all duration-200",
        typeMeta,
        active
          ? "border-gold/40 bg-gold/12 text-gold shadow-[inset_0_0_0_1px_rgba(201,168,76,0.15)]"
          : "border-glass-border bg-black/15 text-white/55 hover:border-white/20 hover:bg-white/[0.03] hover:text-white/85",
      )}
    >
      {label}
    </Link>
  );
}
