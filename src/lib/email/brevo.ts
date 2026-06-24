import { SITE } from "@/constants/site";
import { formatPrice } from "@/utils";
import { getPaymentOption } from "@/constants/payment";
import type { PaymentMethod } from "@/types/db";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

interface EmailRecipient {
  email: string;
  name?: string;
}

interface SendEmailParams {
  to: EmailRecipient[];
  subject: string;
  html: string;
  replyTo?: EmailRecipient;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL);
}

/**
 * Sends a transactional email via Brevo. Returns false (without throwing) when
 * email isn't configured or the request fails, so callers can treat email as
 * best-effort and never block the core flow (e.g. order creation).
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailParams): Promise<boolean> {
  if (!isEmailConfigured()) return false;

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY as string,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME || SITE.name,
        },
        to,
        subject,
        htmlContent: html,
        ...(replyTo ? { replyTo } : {}),
      }),
    });

    if (!res.ok) {
      console.error("Brevo email failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Brevo email error:", error);
    return false;
  }
}

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: PaymentMethod;
  items: { name: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

function orderEmailHtml(data: OrderEmailData): string {
  const rows = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;color:#444;">${item.name} &times; ${item.quantity}</td>
          <td style="padding:8px 0;text-align:right;color:#444;">${formatPrice(
            item.unitPrice * item.quantity,
          )}</td>
        </tr>`,
    )
    .join("");

  const payment = getPaymentOption(data.paymentMethod);

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;">
    <div style="text-align:center;padding-bottom:16px;border-bottom:2px solid #1b6b47;">
      <h1 style="margin:0;font-size:22px;color:#0a1f10;">${SITE.name}</h1>
    </div>
    <h2 style="font-size:18px;margin:24px 0 8px;">Thank you for your order, ${data.customerName}!</h2>
    <p style="color:#555;margin:0 0 16px;">Your order <strong>${data.orderNumber}</strong> has been received.</p>

    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      ${rows}
      <tr><td colspan="2" style="border-top:1px solid #eee;padding-top:8px;"></td></tr>
      <tr>
        <td style="padding:4px 0;color:#777;">Subtotal</td>
        <td style="padding:4px 0;text-align:right;color:#777;">${formatPrice(data.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#777;">Shipping</td>
        <td style="padding:4px 0;text-align:right;color:#777;">${
          data.shippingFee === 0 ? "Free" : formatPrice(data.shippingFee)
        }</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-weight:bold;font-size:16px;">Total</td>
        <td style="padding:8px 0;text-align:right;font-weight:bold;font-size:16px;">${formatPrice(
          data.total,
        )}</td>
      </tr>
    </table>

    ${
      payment
        ? `<div style="background:#f5f9f6;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0 0 6px;font-weight:bold;color:#0a1f10;">Payment: ${payment.label}</p>
            <p style="margin:0;color:#555;font-size:14px;">${payment.instructions}</p>
          </div>`
        : ""
    }

    <p style="color:#555;font-size:14px;">Questions? Reach us on WhatsApp at ${SITE.phone}.</p>
    <p style="color:#999;font-size:12px;margin-top:24px;text-align:center;">${SITE.name} — ${SITE.location}</p>
  </div>`;
}

export async function sendOrderConfirmation(
  data: OrderEmailData,
): Promise<boolean> {
  return sendEmail({
    to: [{ email: data.customerEmail, name: data.customerName }],
    subject: `Order ${data.orderNumber} confirmed — ${SITE.name}`,
    html: orderEmailHtml(data),
  });
}

export async function sendAdminOrderAlert(
  data: OrderEmailData,
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) return false;
  return sendEmail({
    to: [{ email: adminEmail }],
    subject: `New order ${data.orderNumber} (${formatPrice(data.total)})`,
    html: orderEmailHtml(data),
  });
}
