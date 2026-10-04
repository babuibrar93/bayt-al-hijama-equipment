import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { SITE } from "@/constants/site";
import { getPaymentOption } from "@/constants/payment";
import PaymentInstructions, {
  isPrepaidMethod,
} from "@/components/shop/PaymentInstructions";
import { formatPrice } from "@/utils";
import { btnPrimary, btnGhost, cn, pageShell } from "@/lib/classes";
import type { PaymentMethod } from "@/types/db";

export const metadata: Metadata = {
  title: "Order Confirmed",
  alternates: { canonical: "/checkout/success" },
  robots: { index: false, follow: false },
};

interface SuccessPageProps {
  searchParams: Promise<{
    order?: string;
    method?: string;
    total?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order;
  const method = params.method as PaymentMethod | undefined;
  const total = params.total ? Number(params.total) : undefined;
  const paymentOption = method ? getPaymentOption(method) : undefined;
  const prepaid = method ? isPrepaidMethod(method) : false;

  const whatsappText = prepaid
    ? `Assalamu Alaikum! I placed order ${orderNumber ?? ""} and paid via ${paymentOption?.label ?? "online payment"}. Here is my payment screenshot.`
    : `Assalamu Alaikum! I just placed order ${orderNumber ?? ""} (Cash on Delivery). Please confirm.`;

  const whatsappUrl = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className={pageShell}>
      <div className="mx-auto w-full max-w-2xl min-w-0 pt-4 text-center sm:pt-5">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-mid/20 sm:mb-6 sm:h-16 sm:w-16">
          <CheckCircle2 className="h-8 w-8 text-green-light sm:h-9 sm:w-9" aria-hidden="true" />
        </div>
        <h1 className="mb-3 font-body text-[clamp(1.75rem,5vw,3rem)] font-normal text-white">
          {prepaid ? "Order Received" : "Order Confirmed"}
        </h1>
        <p className="mb-6 px-1 text-sm text-white/60 sm:mb-8 sm:text-base">
          {prepaid
            ? "Thank you. Your order is recorded. Send your payment screenshot on WhatsApp so we can verify and dispatch."
            : "Thank you for your order. Pay in cash when it arrives — we'll contact you shortly to confirm delivery."}
        </p>

        {orderNumber && (
          <div className="mb-5 rounded-lg border border-glass-border bg-glass-bg p-4 text-left sm:mb-8 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-glass-border pb-3 sm:pb-4">
              <span className="text-sm text-white/50">Order Number</span>
              <span className="break-all font-body text-base font-semibold text-gold sm:text-lg">
                {orderNumber}
              </span>
            </div>
            {typeof total === "number" && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 sm:pt-4">
                <span className="text-sm text-white/50">Total</span>
                <span className="font-body text-base font-semibold text-white sm:text-lg">
                  {formatPrice(total)}
                </span>
              </div>
            )}
          </div>
        )}

        {paymentOption && method && (
          <div className="mb-6 rounded-lg border border-gold/30 bg-gold/5 p-4 text-left sm:mb-8 sm:p-6">
            <h2 className="mb-3 font-body text-base text-white sm:text-lg">
              {prepaid
                ? `${paymentOption.label} — payment reminder`
                : "Cash on Delivery"}
            </h2>
            <PaymentInstructions
              method={method}
              total={typeof total === "number" ? total : undefined}
              compact
            />
          </div>
        )}

        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(btnPrimary, "w-full justify-center sm:w-auto")}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {prepaid ? "Send receipt on WhatsApp" : "Confirm on WhatsApp"}
          </a>
          <Link
            href="/shop"
            className={cn(btnGhost, "w-full justify-center sm:w-auto")}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
