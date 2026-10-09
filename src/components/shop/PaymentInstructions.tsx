import Image from "next/image";
import {
  BANK_DETAILS,
  EASYPAISA_ACCOUNT_TITLE,
  EASYPAISA_NUMBER,
  JAZZCASH_ACCOUNT_TITLE,
  JAZZCASH_NUMBER,
  PAYMENT_QR,
  getPaymentOption,
} from "@/constants/payment";
import { formatPrice, formatPricePlain } from "@/utils";
import CopyValueButton from "@/components/shop/CopyValueButton";
import type { PaymentMethod } from "@/types/db";

interface PaymentInstructionsProps {
  method: PaymentMethod;
  total?: number;
  /** Compact layout for the success page */
  compact?: boolean;
}

export function isPrepaidMethod(method: PaymentMethod): boolean {
  return (
    method === "bank_transfer" ||
    method === "jazzcash" ||
    method === "easypaisa"
  );
}

function DetailRow({
  label,
  value,
  copyable = false,
  mono = false,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-md bg-black/25 px-3 py-2.5">
      <dt className="text-[0.7rem] uppercase tracking-[0.06em] text-white/40">
        {label}
      </dt>
      <dd className="mt-1 flex items-start gap-2">
        <span
          className={
            mono
              ? "min-w-0 flex-1 break-all font-body text-sm text-white/90 tabular-nums"
              : "min-w-0 flex-1 break-words text-sm text-white/90"
          }
        >
          {value}
        </span>
        {copyable ? <CopyValueButton value={value} label={label} /> : null}
      </dd>
    </div>
  );
}

function QrBlock({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[160px] sm:mx-0 sm:max-w-[140px]">
      <Image
        src={src}
        alt={alt}
        width={280}
        height={280}
        className="h-auto w-full rounded-md bg-white p-2"
      />
      <p className="mt-1.5 text-center text-[0.7rem] text-white/45">{caption}</p>
    </div>
  );
}

export default function PaymentInstructions({
  method,
  total,
  compact = false,
}: PaymentInstructionsProps) {
  const option = getPaymentOption(method);
  if (!option) return null;

  if (method === "cod") {
    return (
      <p className="text-sm leading-relaxed text-white/70">
        {option.instructions}
      </p>
    );
  }

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      {typeof total === "number" && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-gold/25 bg-gold/10 px-3 py-2.5 text-sm text-white/85">
          <span>
            Amount to pay:{" "}
            <span className="font-semibold text-gold">{formatPrice(total)}</span>
          </span>
          <CopyValueButton
            value={formatPricePlain(total)}
            label="Amount"
            className="border-gold/30"
          />
        </div>
      )}

      {method === "bank_transfer" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start">
          <QrBlock
            src={PAYMENT_QR.meezan}
            alt="Meezan Bank payment QR"
            caption="Scan with any banking app"
          />
          <dl className="grid min-w-0 grid-cols-1 gap-2">
            <DetailRow label="Bank" value={BANK_DETAILS.bankName} />
            <DetailRow
              label="Account Title"
              value={BANK_DETAILS.accountTitle}
              copyable
            />
            <DetailRow
              label="Account Number"
              value={BANK_DETAILS.accountNumber}
              copyable
              mono
            />
            <DetailRow
              label="IBAN"
              value={BANK_DETAILS.iban}
              copyable
              mono
            />
          </dl>
        </div>
      )}

      {method === "jazzcash" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start">
          <QrBlock
            src={PAYMENT_QR.jazzcash}
            alt="JazzCash payment QR"
            caption="Scan in JazzCash"
          />
          <dl className="grid min-w-0 grid-cols-1 gap-2">
            <DetailRow
              label="Account"
              value={JAZZCASH_ACCOUNT_TITLE}
              copyable
            />
            <DetailRow
              label="JazzCash Number"
              value={JAZZCASH_NUMBER}
              copyable
              mono
            />
          </dl>
        </div>
      )}

      {method === "easypaisa" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start">
          <QrBlock
            src={PAYMENT_QR.easypaisa}
            alt="Easypaisa payment QR"
            caption="Scan in Easypaisa"
          />
          <dl className="grid min-w-0 grid-cols-1 gap-2">
            <DetailRow
              label="Account"
              value={EASYPAISA_ACCOUNT_TITLE}
              copyable
            />
            <DetailRow
              label="Easypaisa Number"
              value={EASYPAISA_NUMBER}
              copyable
              mono
            />
          </dl>
        </div>
      )}

      <p className="text-sm leading-relaxed text-white/65">
        {compact
          ? "If you haven't paid yet, use the details above, then send your payment screenshot on WhatsApp with your order number."
          : "Pay the amount above, then confirm your order. After placing it, send the payment screenshot on WhatsApp with your order number."}
      </p>
    </div>
  );
}
