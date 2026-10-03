"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, Select, ConfirmModal } from "@/components/ui";
import { PaymentStatusBadge } from "@/components/shop/StatusBadge";
import WhatsAppBillButton from "@/components/admin/WhatsAppBillButton";
import type { OrderWithItems } from "@/types/db";

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

interface OrderActionsPanelProps {
  order: OrderWithItems;
}

export default function OrderActionsPanel({ order }: OrderActionsPanelProps) {
  const orderId = order.id;
  const orderNumber = order.order_number;
  const status = order.status;
  const paymentStatus = order.payment_status;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const update = async (body: Record<string, string>, message: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Update failed");
      }
      toast.success(message);
      setPayOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Delete failed");
      }
      toast.success("Order deleted");
      setDeleteOpen(false);
      router.push("/admin/orders");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-full overflow-hidden rounded-lg border border-glass-border bg-glass-bg lg:sticky lg:top-4 xl:top-6">
      <h2 className="bg-green-mid px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white sm:px-4 sm:py-2.5">
        Actions
      </h2>

      <div className="flex flex-col gap-3 p-3 sm:p-4">
        <Button
          href={`/admin/orders/${orderId}/edit`}
          fullWidth
          variant="subtle"
          leftIcon={<Pencil className="h-4 w-4" />}
        >
          Edit order
        </Button>

        <WhatsAppBillButton order={order} fullWidth />

        <div className="rounded-md border border-glass-border bg-black/20 p-3">
          <Select
            label="Order status"
            options={ORDER_STATUS_OPTIONS}
            value={status}
            onChange={(value) =>
              update({ status: value }, "Order status updated")
            }
            searchable={false}
            disabled={loading}
            containerClassName="w-full"
          />
        </div>

        <div className="rounded-md border border-glass-border bg-black/20 p-3">
          {paymentStatus === "paid" ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-white/50">Payment</span>
                <PaymentStatusBadge status="paid" />
              </div>
              <Button
                variant="subtle"
                fullWidth
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                disabled={loading}
                onClick={() =>
                  update({ payment_status: "unpaid" }, "Marked as unpaid")
                }
              >
                Mark as unpaid
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              fullWidth
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              disabled={loading}
              onClick={() => setPayOpen(true)}
            >
              Mark as paid
            </Button>
          )}
        </div>

        <Button
          type="button"
          variant="danger"
          fullWidth
          leftIcon={<Trash2 className="h-4 w-4" />}
          disabled={loading}
          onClick={() => setDeleteOpen(true)}
        >
          Delete order
        </Button>
      </div>

      <ConfirmModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        onConfirm={() =>
          update({ payment_status: "paid" }, "Payment confirmed")
        }
        loading={loading}
        title="Confirm payment received?"
        description="Confirm only after you've verified the customer's payment (e.g. invoice screenshot on WhatsApp, or bank/wallet transfer). This marks the order as paid."
        confirmLabel="Yes, mark as paid"
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        destructive
        title="Delete order?"
        description={`"${orderNumber}" will be permanently removed. If it is still active it will be cancelled first (stock restored; paid sales marked refunded). This cannot be undone.`}
        confirmLabel="Delete order"
      />
    </aside>
  );
}
