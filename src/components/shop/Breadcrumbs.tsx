import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/classes";

export interface Crumb {
  label: string;
  href?: string;
}

type BreadcrumbVariant = "default" | "header" | "compact";

const variantStyles: Record<
  BreadcrumbVariant,
  { nav: string; list: string; chevron: string; current: string }
> = {
  default: {
    nav: "mb-8",
    list: "gap-1.5 text-sm text-white/50",
    chevron: "h-3.5 w-3.5 text-white/30",
    current: "text-white/80",
  },
  header: {
    nav: "mb-0",
    list: "gap-2 text-sm font-medium text-white/55 sm:text-[0.9375rem]",
    chevron: "h-4 w-4 text-white/35",
    current: "text-white/90",
  },
  compact: {
    nav: "mb-0",
    list: "gap-1.5 text-xs text-white/45",
    chevron: "h-3.5 w-3.5 text-white/30",
    current: "text-white/80",
  },
};

export default function Breadcrumbs({
  items,
  variant = "default",
  compact = false,
  className,
}: {
  items: Crumb[];
  compact?: boolean;
  variant?: BreadcrumbVariant;
  className?: string;
}) {
  const resolvedVariant = compact ? "compact" : variant;
  const styles = variantStyles[resolvedVariant];

  return (
    <nav aria-label="Breadcrumb" className={cn(styles.nav, className)}>
      <ol className={cn("flex flex-wrap items-center", styles.list)}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? styles.current : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  className={styles.chevron}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
