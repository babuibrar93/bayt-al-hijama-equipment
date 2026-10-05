import type { LucideIcon } from "lucide-react";
import { cn, numeric } from "@/lib/classes";

export interface StatCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  hint?: string;
  className?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: StatCardProps) {
  return (
    <div
      title={hint ?? label}
      className={cn(
        "items-center gap-2 rounded-lg border border-glass-border bg-glass-bg px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5",
        Icon
          ? "grid grid-cols-[auto_minmax(0,1fr)_auto]"
          : "grid grid-cols-[minmax(0,1fr)_auto]",
        className,
      )}
    >
      {Icon && (
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold sm:h-9 sm:w-9">
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
        </div>
      )}
      <p className="min-w-0 truncate text-xs leading-5 text-white/60 sm:text-sm">
        {label}
      </p>
      <p
        className={cn(
          "whitespace-nowrap text-right text-sm font-semibold leading-5 text-white sm:text-base lg:text-lg",
          numeric,
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function StatGrid({
  children,
  className,
  columns = 4,
}: {
  children: React.ReactNode;
  className?: string;
  /** Max columns on wide screens. Use 2 next to a side panel. */
  columns?: 2 | 3 | 4;
}) {
  return (
    <div
      className={cn(
        "mb-4 grid gap-2 sm:mb-5 sm:gap-3",
        columns === 2 && "grid-cols-1 min-[380px]:grid-cols-2",
        columns === 3 &&
          "grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-3",
        columns === 4 &&
          "grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
