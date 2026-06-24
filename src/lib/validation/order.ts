import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, "Please enter your full name")
    .max(100),
  customerPhone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .max(20)
    .regex(/^[+\d\s-]+$/, "Phone can only contain digits, spaces, + and -"),
  customerEmail: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  address: z.object({
    line1: z.string().min(5, "Please enter your street address").max(200),
    line2: z.string().max(200).optional().or(z.literal("")),
    city: z.string().min(2, "Please enter your city").max(80),
    province: z.string().min(2, "Please select your province").max(80),
    postalCode: z.string().max(20).optional().or(z.literal("")),
  }),
  paymentMethod: z.enum(["cod", "bank_transfer", "jazzcash", "easypaisa"]),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(99),
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
