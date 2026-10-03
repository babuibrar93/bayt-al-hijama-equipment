"use client";

import { cn } from "@/lib/classes";
import Pagination from "./Pagination";

/** Serializable pagination config — pass from Server Components (no functions). */
export interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  pathname: string;
  /** Filters / search params to keep in the URL when paging. */
  query?: Record<string, string | undefined>;
}

export function Table({
  children,
  minWidth = "min-w-[640px]",
  pagination,
  className,
}: {
  children: React.ReactNode;
  minWidth?: string;
  pagination?: TablePaginationProps;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-full overflow-hidden rounded-lg border border-glass-border",
        className,
      )}
    >
      <div className="admin-table-scroll w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
        <table className={cn("w-full text-left text-xs sm:text-sm", minWidth)}>
          {children}
        </table>
      </div>
      {pagination && pagination.totalItems > 0 && (
        <div className="border-t border-glass-border bg-white/[0.03]">
          <Pagination
            variant="table"
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            perPage={pagination.perPage}
            pathname={pagination.pathname}
            query={pagination.query}
          />
        </div>
      )}
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-white/5 text-[0.65rem] uppercase tracking-wider text-white/40 sm:text-xs">
      {children}
    </thead>
  );
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-glass-border">{children}</tbody>;
}

export function Tr({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <tr className={cn("text-white/80", className)}>{children}</tr>;
}

export function Th({
  children,
  className,
  align = "left",
}: {
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}) {
  return (
    <th
      className={cn(
        "whitespace-nowrap px-2.5 py-2.5 font-medium sm:px-4 sm:py-3",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  align = "left",
}: {
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}) {
  return (
    <td
      className={cn(
        "px-2.5 py-2.5 sm:px-4 sm:py-3",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </td>
  );
}
