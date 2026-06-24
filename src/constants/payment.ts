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
  accountTitle: "Bayt Al Hijama Equipment",
  accountNumber: "0000-0000000000",
  iban: "PK00MEZN0000000000000000",
};

export const JAZZCASH_NUMBER = "+92 329 3561309";
export const EASYPAISA_NUMBER = "+92 329 3561309";

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
    description: "Transfer to our bank account and share the receipt.",
    instructions: `Transfer the total to ${BANK_DETAILS.bankName}, Account Title: ${BANK_DETAILS.accountTitle}, Account #: ${BANK_DETAILS.accountNumber}, IBAN: ${BANK_DETAILS.iban}. Then send the receipt on WhatsApp with your order number.`,
  },
  {
    id: "jazzcash",
    label: "JazzCash",
    description: "Send payment to our JazzCash account.",
    instructions: `Send the total to JazzCash number ${JAZZCASH_NUMBER}, then share a screenshot on WhatsApp with your order number.`,
  },
  {
    id: "easypaisa",
    label: "Easypaisa",
    description: "Send payment to our Easypaisa account.",
    instructions: `Send the total to Easypaisa number ${EASYPAISA_NUMBER}, then share a screenshot on WhatsApp with your order number.`,
  },
];

export function getPaymentOption(id: PaymentMethod): PaymentOption | undefined {
  return PAYMENT_OPTIONS.find((option) => option.id === id);
}
