import { cn } from "@/lib/classes";

interface AdminTableSkeletonProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export default function AdminTableSkeleton({
  columns = 6,
  rows = 8,
  className,
}: AdminTableSkeletonProps) {
  return (
    <div
      className={cn(
        "max-w-full overflow-hidden rounded-lg border border-glass-border",
        className,
      )}
      aria-hidden="true"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-white/5">
            <tr>
              {Array.from({ length: columns }, (_, i) => (
                <th key={i} className="px-2.5 py-2.5 sm:px-4 sm:py-3">
                  <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border">
            {Array.from({ length: rows }, (_, r) => (
              <tr key={r}>
                {Array.from({ length: columns }, (_, c) => (
                  <td key={c} className="px-2.5 py-3 sm:px-4">
                    <div
                      className={cn(
                        "h-3.5 animate-pulse rounded bg-white/[0.08]",
                        c === 0 ? "w-28 sm:w-36" : "w-16 sm:w-20",
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
