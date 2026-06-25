import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Copy } from "lucide-react";
import { SITE } from "@/constants/site";
import {
  getPaymentOption,
  BANK_DETAILS,
} from "@/constants/payment";
import { formatPrice } from "@/utils";
import { btnPrimary, btnGhost, cn } from "@/lib/classes";
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

  const whatsappUrl = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
    `Assalamu Alaikum! I just placed order ${orderNumber ?? ""}. Please confirm.`,
  )}`;

  return (
    <div className="px-6 pb-24 pt-nav">
      <div className="mx-auto w-full max-w-2xl pt-16 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-mid/20">
          <CheckCircle2 className="h-9 w-9 text-green-light" aria-hidden="true" />
        </div>
        <h1 className="mb-3 font-body text-[clamp(2rem,4vw,3rem)] font-normal text-white">
          Order Confirmed
        </h1>
        <p className="mb-8 text-white/60">
          Thank you for your order. We&apos;ve received it and will contact you
          shortly to confirm delivery.
        </p>

        {orderNumber && (
          <div className="mb-8 rounded-lg border border-glass-border bg-glass-bg p-6 text-left">
            <div className="flex items-center justify-between border-b border-glass-border pb-4">
              <span className="text-sm text-white/50">Order Number</span>
              <span className="font-body text-lg font-semibold text-gold">
                {orderNumber}
              </span>
            </div>
            {typeof total === "number" && (
              <div className="flex items-center justify-between pt-4">
                <span className="text-sm text-white/50">Total</span>
                <span className="font-body text-lg font-semibold text-white">
                  {formatPrice(total)}
                </span>
              </div>
            )}
          </div>
        )}

        {paymentOption && (
          <div className="mb-8 rounded-lg border border-gold/30 bg-gold/5 p-6 text-left">
            <h2 className="mb-3 flex items-center gap-2 font-body text-lg text-white">
              <Copy className="h-4 w-4 text-gold" aria-hidden="true" />
              {paymentOption.label} Instructions
            </h2>
            <p className="text-sm leading-relaxed text-white/70">
              {paymentOption.instructions}
            </p>
            {method === "bank_transfer" && (
              <dl className="mt-4 grid grid-cols-1 gap-2 rounded-sm bg-black/30 p-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-white/40">Bank</dt>
                  <dd className="text-white/80">{BANK_DETAILS.bankName}</dd>
                </div>
                <div>
                  <dt className="text-white/40">Account Title</dt>
                  <dd className="text-white/80">{BANK_DETAILS.accountTitle}</dd>
                </div>
                <div>
                  <dt className="text-white/40">Account Number</dt>
                  <dd className="text-white/80">{BANK_DETAILS.accountNumber}</dd>
                </div>
                <div>
                  <dt className="text-white/40">IBAN</dt>
                  <dd className="text-white/80">{BANK_DETAILS.iban}</dd>
                </div>
              </dl>
            )}
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(btnPrimary, "w-full justify-center sm:w-auto")}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Confirm on WhatsApp
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
