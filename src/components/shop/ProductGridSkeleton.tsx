import { productGrid } from "@/lib/classes";

const SKELETON_CARDS = 16;

/** Placeholder grid shown while shop search results load. */
export default function ProductGridSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading products</span>
      <div className="mb-4 h-4 w-40 animate-pulse rounded bg-white/10" />
      <div className={productGrid}>
        {Array.from({ length: SKELETON_CARDS }, (_, index) => (
          <div
            key={index}
            className="flex h-full flex-col overflow-hidden rounded-lg border border-glass-border bg-glass-bg"
          >
            <div className="aspect-[4/3] w-full animate-pulse bg-neutral-200 sm:aspect-[5/4] lg:aspect-[4/3]" />
            <div className="flex flex-1 flex-col p-2.5 sm:p-3">
              <div className="mb-2 h-2.5 w-16 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
              <div className="mt-1.5 h-4 w-3/5 animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-3 w-full animate-pulse rounded bg-white/[0.06]" />
              <div className="mt-auto pt-3">
                <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-10 animate-pulse rounded-sm bg-white/10 sm:h-11" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
