import { z } from "zod";

/**
 * Cups are stocked and ordered in the hundreds. Stock is checked again
 * when the order is created; this only blocks absurd payloads.
 */
const MAX_LINE_QUANTITY = 10000;

const PHONE_ERROR = "Please enter a valid phone number";

/** Contact-app and WhatsApp numbers often include (), dots, or invisible marks. */
export function normalizePhone(value: string): string {
  let phone = value.normalize("NFKC");
  phone = phone.replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "");
  phone = phone.replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
  phone = phone.replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0));
  phone = phone.replace(/[()./]/g, " ");
  phone = phone.replace(/[^\d+\s-]/g, "");
  return phone.replace(/\s+/g, " ").trim();
}

const customerPhoneSchema = z
  .string()
  .transform((value) => normalizePhone(value))
  .pipe(
    z
      .string()
      .min(10, PHONE_ERROR)
      .max(20, PHONE_ERROR)
      .regex(/^[+\d\s-]+$/, PHONE_ERROR)
      .refine((value) => {
        const digits = value.replace(/\D/g, "").length;
        return digits >= 10 && digits <= 15;
      }, PHONE_ERROR),
  );

const optionalEmailSchema = z
  .string()
  .trim()
  .max(120)
  .optional()
  .or(z.literal(""))
  .refine(
    (value) =>
      value === undefined ||
      value === "" ||
      z.string().email().safeParse(value).success,
    "Please enter a valid email",
  );

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100),
  customerPhone: customerPhoneSchema,
  customerEmail: optionalEmailSchema,
  address: z.object({
    line1: z.string().trim().min(3, "Please enter your street address").max(200),
    line2: z.string().trim().max(200).optional().or(z.literal("")),
    city: z.string().trim().min(2, "Please enter your city").max(80),
    province: z.string().trim().min(2, "Please select your province").max(80),
    postalCode: z.string().trim().max(20).optional().or(z.literal("")),
  }),
  paymentMethod: z.enum(["cod", "bank_transfer", "jazzcash", "easypaisa"]),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be at least 1")
    .max(MAX_LINE_QUANTITY, "Quantity is too large"),
});

export const createOrderSchema = checkoutSchema.extend({
  items: z.array(orderItemSchema).min(1, "Your cart is empty"),
});

export type CreateOrderPayload = z.infer<typeof createOrderSchema>;

export const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Kashmir",
] as const;
