import Badge, { type BadgeTone } from "@/components/ui/Badge";
import type { OrderStatus, PaymentStatus } from "@/types/db";

const ORDER_TONES: Record<OrderStatus, BadgeTone> = {
  pending: "amber",
  confirmed: "blue",
  shipped: "indigo",
  delivered: "green",
  cancelled: "red",
};

const PAYMENT_TONES: Record<PaymentStatus, BadgeTone> = {
  unpaid: "neutral",
  paid: "green",
  refunded: "red",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={ORDER_TONES[status]}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge tone={PAYMENT_TONES[status]}>{status}</Badge>;
}
