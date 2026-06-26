"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button, Select, ConfirmModal } from "@/components/ui";
import { PaymentStatusBadge } from "@/components/shop/StatusBadge";
import type { OrderStatus, PaymentStatus } from "@/types/db";

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

interface OrderControlsProps {
  orderId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}

export default function OrderControls({
  orderId,
  status,
  paymentStatus,
}: OrderControlsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

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

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Select
        options={ORDER_STATUS_OPTIONS}
        value={status}
        onChange={(value) => update({ status: value }, "Order status updated")}
        searchable={false}
        disabled={loading}
        containerClassName="w-full min-w-[8.5rem] sm:w-40"
      />

      {paymentStatus === "paid" ? (
        <div className="flex items-center gap-2">
          <PaymentStatusBadge status="paid" />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            disabled={loading}
            onClick={() =>
              update({ payment_status: "unpaid" }, "Marked as unpaid")
            }
          >
            Undo
          </Button>
        </div>
      ) : (
        <Button
          variant="primary"
          size="sm"
          leftIcon={<CheckCircle2 className="h-4 w-4" />}
          disabled={loading}
          onClick={() => setPayOpen(true)}
        >
          Mark as Paid
        </Button>
      )}

      <ConfirmModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        onConfirm={() =>
          update({ payment_status: "paid" }, "Payment confirmed")
        }
        loading={loading}
        title="Confirm payment received?"
        description="Confirm only after you've verified the customer's payment (e.g. the invoice screenshot shared on WhatsApp, or bank/wallet transfer). This marks the order as paid."
        confirmLabel="Yes, mark as paid"
      />
    </div>
  );
}
