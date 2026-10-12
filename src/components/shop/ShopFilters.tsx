"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Select } from "@/components/ui";
import ProductGridSkeleton from "@/components/shop/ProductGridSkeleton";
import { cn, fieldBorder, typeBodySm } from "@/lib/classes";
import type { Category } from "@/types/db";
import type { ProductSort } from "@/lib/products";

const SEARCH_DEBOUNCE_MS = 350;

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
  /** Product results. Replaced with a skeleton while a filter is loading. */
  children?: React.ReactNode;
}

export default function ShopFilters({
  categories,
  activeCategory,
  activeSort,
  activeSearch,
  children,
}: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(activeSearch);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<number | null>(null);
  /** Query we already sent, so a late URL update does not wipe newer typing. */
  const pendingQueryRef = useRef<string | null>(null);
  /** Skip one debounce cycle after an immediate clear. */
  const skipDebounceRef = useRef(false);

  useEffect(() => {
    if (pendingQueryRef.current !== null) {
      if (pendingQueryRef.current === activeSearch.trim()) {
        pendingQueryRef.current = null;
      }
      return;
    }
    setSearch(activeSearch);
  }, [activeSearch]);

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

  const commitSearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (trimmed === activeSearch.trim()) return;
      pendingQueryRef.current = trimmed;
      startTransition(() => {
        updateParams({ search: trimmed || undefined });
      });
    },
    [activeSearch, updateParams],
  );

  useEffect(() => {
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }
    if (search.trim() === activeSearch.trim()) return;
    debounceRef.current = window.setTimeout(() => {
      commitSearch(search);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [search, activeSearch, commitSearch]);

  const submitSearchNow = () => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    commitSearch(search);
  };

  const onSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitSearchNow();
  };

  const selectSort = (value: string) => {
    const next = value === "newest" ? undefined : value;
    const current = activeSort === "newest" ? undefined : activeSort;
    if (next === current) return;
    startTransition(() => {
      updateParams({ sort: next });
    });
  };

  const selectCategory = (slug?: string) => {
    if ((slug ?? "") === (activeCategory ?? "")) return;
    startTransition(() => {
      updateParams({ category: slug });
    });
  };

  const hasUrlFilters =
    Boolean(activeSearch.trim()) ||
    Boolean(activeCategory) ||
    activeSort !== "newest";
  const showClear = hasUrlFilters || Boolean(search.trim());

  const clearFilters = () => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    skipDebounceRef.current = true;
    setSearch("");
    if (!hasUrlFilters) return;
    pendingQueryRef.current = "";
    startTransition(() => {
      router.push("/shop", { scroll: false });
    });
  };

  const fieldClass = cn(
    "h-10 rounded-lg border bg-black/20 text-white transition-colors focus:outline-none sm:h-11",
    fieldBorder,
    typeBodySm,
  );

  return (
    <>
    <div
      className={cn(
        "relative mb-5 overflow-hidden rounded-xl border border-glass-border bg-glass-bg sm:mb-6",
        "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-[1] before:w-[3px] before:bg-gradient-to-b before:from-gold before:via-green-mid/70 before:to-transparent",
      )}
    >
      <div className="flex items-center gap-2 border-b border-glass-border/50 px-4 py-3 sm:gap-3 sm:px-5 sm:py-3.5">
        <form
          onSubmit={onSearchSubmit}
          className="relative min-w-0 flex-1 max-w-md"
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
                if (debounceRef.current) window.clearTimeout(debounceRef.current);
                skipDebounceRef.current = true;
                setSearch("");
                commitSearch("");
              }}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </form>

        <div className="w-[9.25rem] shrink-0 sm:w-auto sm:min-w-[13.5rem]">
          <Select
            options={SORT_OPTIONS}
            value={activeSort}
            onChange={selectSort}
            placeholder="Sort by"
            searchable={false}
            containerClassName="w-full"
          />
        </div>
        {showClear ? (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto inline-flex h-10 shrink-0 items-center gap-1 whitespace-nowrap text-[0.68rem] font-medium text-gold transition-colors hover:text-gold-light sm:h-11 sm:text-xs"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="mb-2.5 flex items-center gap-2">
          <span className="h-px w-4 shrink-0 bg-gold/80" aria-hidden="true" />
          <span
            className={cn(
              "text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold sm:text-xs sm:tracking-[0.14em]",
            )}
          >
            Categories
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterPill
            label="All"
            active={!activeCategory}
            onSelect={() => selectCategory(undefined)}
          />
          {categories.map((category) => (
            <FilterPill
              key={category.id}
              label={category.name}
              active={activeCategory === category.slug}
              onSelect={() => selectCategory(category.slug)}
            />
          ))}
        </div>
      </div>
    </div>

    <div aria-busy={isPending}>
      {isPending ? <ProductGridSkeleton /> : children}
    </div>
    </>
  );
}

function FilterPill({
  label,
  active,
  onSelect,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!active) onSelect();
      }}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-8 items-center rounded-md border px-2.5 py-1 text-[0.68rem] font-medium leading-none transition-all duration-200 sm:min-h-9 sm:rounded-lg sm:px-3.5 sm:py-1.5 sm:text-[0.78rem] md:min-h-10 md:px-4 md:text-[0.82rem]",
        active
          ? "border-gold/40 bg-gold/12 text-gold shadow-[inset_0_0_0_1px_rgba(201,168,76,0.15)]"
          : "border-glass-border bg-black/15 text-white/55 hover:border-white/20 hover:bg-white/[0.03] hover:text-white/85",
      )}
    >
      {label}
    </button>
  );
}
