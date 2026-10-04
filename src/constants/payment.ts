import type { PaymentMethod } from "@/types/db";

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description: string;
  instructions: string;
}

/**
 * Flat nationwide shipping fee in PKR. Free over the threshold.
 */
export const SHIPPING_FEE = 250;
export const FREE_SHIPPING_THRESHOLD = 10000;

export const CURRENCY = "PKR";

/**
 * Update these account details with the store's real payment accounts.
 */
export const BANK_DETAILS = {
  bankName: "Meezan Bank",
  accountTitle: "MUHAMMAD IBRAR ASIF",
  /** From Meezan Raast QR payload */
  accountNumber: "02420106548160",
  iban: "PK56MEZN0002420106548160",
};

export const JAZZCASH_NUMBER = "+92 329 3561309";
export const JAZZCASH_ACCOUNT_TITLE = "Muhammad Bilal Asif";
export const EASYPAISA_NUMBER = "+92 344 4850952";
export const EASYPAISA_ACCOUNT_TITLE = "MUHAMMAD ABRAR ASIF";

/**
 * Official payment QR images in /public/payments.
 * Prefer these over auto-generated text QRs (bank apps scan them correctly).
 */
export const PAYMENT_QR = {
  meezan: "/payments/meezan-qr.jpg",
  jazzcash: "/payments/jazzcash-qr.png",
  easypaisa: "/payments/easypaisa-qr.png",
} as const;

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay in cash when your order arrives.",
    instructions:
      "Keep the exact amount ready. Our courier will collect payment on delivery.",
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    description: "Pay by bank transfer / Raast QR, then confirm your order.",
    instructions: `Transfer the total to ${BANK_DETAILS.bankName} (${BANK_DETAILS.accountTitle}, IBAN ${BANK_DETAILS.iban}), then send the receipt on WhatsApp with your order number.`,
  },
  {
    id: "jazzcash",
    label: "JazzCash",
    description: "Pay via JazzCash QR or number, then confirm your order.",
    instructions: `Send the total to JazzCash (${JAZZCASH_ACCOUNT_TITLE}, ${JAZZCASH_NUMBER}), then send a screenshot on WhatsApp with your order number.`,
  },
  {
    id: "easypaisa",
    label: "Easypaisa",
    description: "Pay via Easypaisa, then confirm your order.",
    instructions: `Send the total to Easypaisa (${EASYPAISA_ACCOUNT_TITLE}, ${EASYPAISA_NUMBER}), then send a screenshot on WhatsApp with your order number.`,
  },
];

export function getPaymentOption(id: PaymentMethod): PaymentOption | undefined {
  return PAYMENT_OPTIONS.find((option) => option.id === id);
}
