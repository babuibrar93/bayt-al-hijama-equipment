import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";

export default function AdminInventoryLoading() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
        <div className="h-8 w-36 animate-pulse rounded bg-white/10 sm:h-9" />
        <div className="h-9 w-9 animate-pulse rounded-md bg-white/10" />
      </div>
      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:mb-6 sm:grid-cols-4 sm:gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-[3.25rem] animate-pulse rounded-lg border border-glass-border bg-white/[0.04]"
          />
        ))}
      </div>
      <AdminTableSkeleton columns={4} rows={8} />
    </div>
  );
}