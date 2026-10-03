import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/classes";

export interface PeriodCrumb {
  label: string;
  href?: string;
}

export default function PeriodBreadcrumb({
  items,
  className,
}: {
  items: PeriodCrumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Period"
      className={cn(
        "mb-3 flex flex-wrap items-center gap-1 text-xs text-white/50 sm:mb-4 sm:gap-1.5 sm:text-sm",
        className,
      )}
    >
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/30" />
            )}
            {item.href && !last ? (
              <Link
                href={item.href}
                className="text-gold transition-colors hover:text-gold-light"
              >
                {item.label}
              </Link>
            ) : (
              <span className={last ? "text-white/80" : undefined}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
