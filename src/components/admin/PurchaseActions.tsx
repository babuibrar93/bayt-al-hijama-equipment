"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import type { PurchaseStatus } from "@/types/db";

interface PurchaseActionsProps {
  purchaseId: string;
  status: PurchaseStatus;
  purchaseNumber: string;
}

export default function PurchaseActions({
  purchaseId,
  status,
  purchaseNumber,
}: PurchaseActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const patchStatus = async (next: PurchaseStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/purchases/${purchaseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Update failed");
      toast.success(`Marked ${next}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!confirm(`Delete purchase ${purchaseNumber}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/purchases/${purchaseId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Delete failed");
      toast.success("Purchase deleted");
      router.push("/admin/purchases");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-glass-border bg-glass-bg p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 sm:p-4">
      <span className="min-w-0 text-xs text-white/60 sm:mr-auto sm:text-sm">
        Quick status for{" "}
        <span className="font-medium text-white/80">{purchaseNumber}</span>
      </span>
      <div className="flex flex-wrap gap-2">
        {status === "draft" && (
          <Button
            size="sm"
            loading={loading}
            onClick={() => patchStatus("confirmed")}
          >
            Confirm (stock in)
          </Button>
        )}
        {status === "confirmed" && (
          <Button
            size="sm"
            variant="ghost"
            loading={loading}
            onClick={() => patchStatus("cancelled")}
          >
            Cancel (stock out)
          </Button>
        )}
        {(status === "draft" || status === "cancelled") && (
          <Button
            size="sm"
            variant="ghost"
            loading={loading}
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
