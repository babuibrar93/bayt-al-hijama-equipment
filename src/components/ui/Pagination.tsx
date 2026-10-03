"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, numeric } from "@/lib/classes";
import { buildListHref } from "@/lib/admin/list-href";
import Button from "./Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Total row count for “Showing X–Y of Z”. */
  totalItems?: number;
  /** Used for the range label and to keep `perPage` in the URL when present. */
  perPage?: number;
  /** Base path for URL-driven pagination (serializable — no functions). */
  pathname: string;
  /** Current filter/query params to preserve (serializable). */
  query?: Record<string, string | undefined>;
  /**
   * `default` — centered page links (shop).
   * `table` — footer with summary + page controls (used inside Table).
   */
  variant?: "default" | "table";
  className?: string;
}

function pageWindow(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  pathname,
  query = {},
  variant = "default",
  className,
}: PaginationProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const safeTotalPages = Math.max(1, totalPages);
  const size = perPage ?? 10;
  const total = totalItems ?? 0;
  const from = total === 0 ? 0 : (currentPage - 1) * size + 1;
  const to = Math.min(currentPage * size, total);

  const hrefFor = (page: number) =>
    buildListHref(pathname, query, {
      page,
      perPage: variant === "table" ? size : undefined,
    });

  const navigate = (href: string) => {
    startTransition(() => router.push(href));
  };

  if (safeTotalPages <= 1) {
    if (variant === "default") return null;
    if (total === 0) return null;
  }

  const pages = pageWindow(currentPage, safeTotalPages);

  const pageButtons =
    safeTotalPages > 1 ? (
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage <= 1 || pending}
          aria-label="Previous page"
          className="!px-2.5"
          onClick={() => navigate(hrefFor(currentPage - 1))}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`dots-${index}`}
              className="px-1.5 text-sm text-white/35"
              aria-hidden
            >
              …
            </span>
          ) : page === currentPage ? (
            <Button
              key={page}
              variant="secondary"
              size="sm"
              disabled
              aria-current="page"
              aria-label={`Page ${page}`}
              className={cn("min-w-9 !px-2.5", numeric)}
            >
              {page}
            </Button>
          ) : (
            <Button
              key={page}
              variant="ghost"
              size="sm"
              href={hrefFor(page)}
              aria-label={`Page ${page}`}
              className={cn("min-w-9 !px-2.5", numeric)}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage >= safeTotalPages || pending}
          aria-label="Next page"
          className="!px-2.5"
          onClick={() => navigate(hrefFor(currentPage + 1))}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    ) : null;

  if (variant === "default") {
    return (
      <nav
        aria-label="Pagination"
        className={cn("mt-10 flex justify-center", className)}
      >
        {pageButtons}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Table pagination"
      className={cn(
        "flex flex-col gap-2.5 px-2.5 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-3",
        className,
      )}
    >
      <p className={cn("text-xs text-white/50 sm:text-sm", numeric)}>
        Showing{" "}
        <span className="font-medium text-white/80">
          {from}–{to}
        </span>{" "}
        of <span className="font-medium text-white/80">{total}</span>
      </p>
      <div className="min-w-0">{pageButtons}</div>
    </nav>
  );
}
