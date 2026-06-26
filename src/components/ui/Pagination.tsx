import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/classes";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Returns the href for a given page (server-side pagination via URL). */
  buildHref: (page: number) => string;
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
  buildHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = pageWindow(currentPage, totalPages);
  const cellBase =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm transition-colors";

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-1.5"
    >
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          aria-label="Previous page"
          className={cn(cellBase, "border-glass-border text-white/70 hover:border-white/30 hover:text-white")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(cellBase, "border-glass-border text-white/20")}>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {pages.map((page, index) =>
        page === "..." ? (
          <span key={`dots-${index}`} className="px-1 text-white/40">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              cellBase,
              "tabular-nums",
              page === currentPage
                ? "border-gold bg-gold/15 text-gold"
                : "border-glass-border text-white/70 hover:border-white/30 hover:text-white",
            )}
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          aria-label="Next page"
          className={cn(cellBase, "border-glass-border text-white/70 hover:border-white/30 hover:text-white")}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(cellBase, "border-glass-border text-white/20")}>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
