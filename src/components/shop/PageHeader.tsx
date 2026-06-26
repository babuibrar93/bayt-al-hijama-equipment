import { cn } from "@/lib/classes";
import Breadcrumbs, { type Crumb } from "@/components/shop/Breadcrumbs";

interface PageHeaderProps {
  crumbs: Crumb[];
  eyebrow: string;
  description: string;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  crumbs,
  eyebrow,
  description,
  actions,
  className,
}: PageHeaderProps) {
  const pageLabel = crumbs[crumbs.length - 1]?.label ?? eyebrow;

  return (
    <header
      className={cn(
        "relative mb-5 overflow-hidden rounded-xl border border-glass-border bg-glass-bg sm:mb-6",
        "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-[1] before:w-[3px] before:bg-gradient-to-b before:from-gold before:via-green-mid/70 before:to-transparent",
        className,
      )}
    >
      <div className="relative border-b border-glass-border/50 bg-black/30 px-4 py-2.5 sm:px-5 sm:py-3">
        <Breadcrumbs items={crumbs} variant="header" />
      </div>

      <div className="relative px-4 py-4 sm:px-5 sm:py-[1rem]">
        <h1 className="sr-only">{pageLabel}</h1>

        <div className="mb-1 flex items-center gap-2.5">
          <span
            className="h-px w-5 shrink-0 bg-gold sm:w-6"
            aria-hidden="true"
          />
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold sm:text-[0.72rem] sm:tracking-[0.18em]">
            {eyebrow}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="min-w-0 flex-1 text-[0.8125rem] leading-relaxed text-white/55 sm:text-sm sm:leading-[1.65]">
            {description}
          </p>

          {actions ? (
            <div className="flex shrink-0 items-center border-t border-glass-border/40 pt-3 sm:border-t-0 sm:pt-0">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
