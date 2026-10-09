import { z } from "zod";

export const adminOrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be at least 1"),
  /** Optional admin override; defaults to product price. Decimals allowed (e.g. 23.5). */
  unitPrice: z
    .number()
    .finite()
    .nonnegative("Unit price must be 0 or greater")
    .optional(),
});

const orderDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date");

/** Empty / null email is allowed; non-empty must be valid. Omitted stays undefined. */
const optionalEmailSchema = z
  .union([z.string().email("Please enter a valid email"), z.literal(""), z.null()])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    if (value === "" || value === null) return null;
    return value;
  });

/** Address fields are optional for walk-in / WhatsApp admin orders. */
const adminAddressSchema = z.object({
  line1: z.string().max(200),
  line2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().max(100),
  province: z.string().max(80),
  postalCode: z.string().max(20).optional().or(z.literal("")),
});

export const createAdminOrderSchema = z.object({
  customerName: z.string().min(2, "Name is required").max(120),
  customerPhone: z.string().min(7, "Phone is required").max(40),
  customerEmail: optionalEmailSchema,
  paymentMethod: z.enum(["cod", "bank_transfer", "jazzcash", "easypaisa"]),
  paymentStatus: z.enum(["unpaid", "paid", "refunded"]).default("unpaid"),
  status: z
    .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .default("pending"),
  /** Asia/Karachi calendar day for the order (maps to created_at). */
  orderDate: orderDateSchema.optional(),
  shippingFee: z
    .number()
    .finite()
    .nonnegative("Shipping fee must be 0 or greater")
    .optional(),
  notes: z.string().max(2000).optional().or(z.literal("")),
  address: adminAddressSchema,
  items: z.array(adminOrderItemSchema).min(1, "Add at least one product"),
});

export const updateAdminOrderSchema = z.object({
  customerName: z.string().min(2, "Name is required").max(120).optional(),
  customerPhone: z.string().min(7, "Phone is required").max(40).optional(),
  customerEmail: optionalEmailSchema,
  paymentMethod: z
    .enum(["cod", "bank_transfer", "jazzcash", "easypaisa"])
    .optional(),
  paymentStatus: z.enum(["unpaid", "paid", "refunded"]).optional(),
  status: z
    .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .optional(),
  orderDate: orderDateSchema.optional(),
  shippingFee: z
    .number()
    .finite()
    .nonnegative("Shipping fee must be 0 or greater")
    .optional(),
  notes: z.string().max(2000).nullable().optional(),
  address: adminAddressSchema.optional(),
  items: z.array(adminOrderItemSchema).min(1).optional(),
});

export type CreateAdminOrderInput = z.infer<typeof createAdminOrderSchema>;
export type UpdateAdminOrderInput = z.infer<typeof updateAdminOrderSchema>;
