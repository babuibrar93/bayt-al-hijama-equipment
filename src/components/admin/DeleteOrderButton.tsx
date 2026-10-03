"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, ConfirmModal } from "@/components/ui";

export default function DeleteOrderButton({
  id,
  orderNumber,
  variant = "button",
}: {
  id: string;
  orderNumber: string;
  variant?: "button" | "icon";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Delete failed");
      }
      toast.success("Order deleted");
      setOpen(false);
      const onDetail =
        pathname === `/admin/orders/${id}` ||
        pathname?.startsWith(`/admin/orders/${id}/`);
      if (onDetail) {
        router.push("/admin/orders");
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Delete ${orderNumber}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-glass-border text-white/60 transition-colors hover:border-red-400/40 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ) : (
        <Button
          type="button"
          variant="danger"
          size="sm"
          leftIcon={<Trash2 className="h-4 w-4" />}
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      )}
      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        destructive
        title="Delete order?"
        description={`"${orderNumber}" will be permanently removed. If it is still active it will be cancelled first (stock restored; paid sales marked refunded). This cannot be undone.`}
        confirmLabel="Delete order"
      />
    </>
  );
}
