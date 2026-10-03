import { SITE } from "@/constants/site";
import { formatPrice } from "@/utils";
import type { OrderWithItems } from "@/types/db";

/** Normalize Pakistan phone to digits for wa.me (92xxxxxxxxxx). */
export function toWhatsAppPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("92") && digits.length >= 12) return digits;
  if (digits.startsWith("0") && digits.length >= 11) {
    return `92${digits.slice(1)}`;
  }
  if (digits.length === 10 && digits.startsWith("3")) {
    return `92${digits}`;
  }
  return digits;
}

/** Short customer chat message (no PDF / admin status language). */
export function buildWhatsAppBillMessage(order: OrderWithItems): string {
  return [
    `Assalam o Alaikum ${order.customer_name},`,
    "",
    `Your order *${order.order_number}* from *${SITE.shortName}*`,
    `Total: *${formatPrice(Number(order.total))}*`,
    "",
    "Thank you for your order. Please message us if you have any questions.",
  ].join("\n");
}

export function whatsappBillUrl(order: OrderWithItems): string | null {
  const phone = toWhatsAppPhone(order.customer_phone);
  if (!phone) return null;
  const text = encodeURIComponent(buildWhatsAppBillMessage(order));
  return `https://wa.me/${phone}?text=${text}`;
}
