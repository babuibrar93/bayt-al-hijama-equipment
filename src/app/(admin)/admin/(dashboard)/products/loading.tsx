import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";

export default function AdminProductsLoading() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
        <div className="h-8 w-36 animate-pulse rounded bg-white/10 sm:h-9" />
        <div className="flex shrink-0 gap-2">
          <div className="h-9 w-9 animate-pulse rounded-md bg-white/10" />
          <div className="h-9 w-9 animate-pulse rounded-md bg-white/10 sm:w-28" />
        </div>
      </div>
      <AdminTableSkeleton columns={7} rows={8} />
    </div>
  );
}
