import { z } from "zod";

export const adminOrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  /** Optional admin override; defaults to product price */
  unitPrice: z.number().nonnegative().optional(),
});

export const createAdminOrderSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerPhone: z.string().min(7).max(40),
  customerEmail: z.string().email().optional().or(z.literal("")),
  paymentMethod: z.enum(["cod", "bank_transfer", "jazzcash", "easypaisa"]),
  paymentStatus: z.enum(["unpaid", "paid", "refunded"]).default("unpaid"),
  status: z
    .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .default("pending"),
  shippingFee: z.number().nonnegative().optional(),
  notes: z.string().max(2000).optional().or(z.literal("")),
  address: z.object({
    line1: z.string().min(1).max(200),
    line2: z.string().max(200).optional().or(z.literal("")),
    city: z.string().min(1).max(100),
    province: z.string().min(1).max(80),
    postalCode: z.string().max(20).optional().or(z.literal("")),
  }),
  items: z.array(adminOrderItemSchema).min(1),
});

export const updateAdminOrderSchema = z.object({
  customerName: z.string().min(2).max(120).optional(),
  customerPhone: z.string().min(7).max(40).optional(),
  customerEmail: z.string().email().nullable().optional(),
  paymentMethod: z
    .enum(["cod", "bank_transfer", "jazzcash", "easypaisa"])
    .optional(),
  paymentStatus: z.enum(["unpaid", "paid", "refunded"]).optional(),
  status: z
    .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .optional(),
  shippingFee: z.number().nonnegative().optional(),
  notes: z.string().max(2000).nullable().optional(),
  address: z
    .object({
      line1: z.string().min(1).max(200),
      line2: z.string().max(200).optional().or(z.literal("")),
      city: z.string().min(1).max(100),
      province: z.string().min(1),
      postalCode: z.string().max(20).optional().or(z.literal("")),
    })
    .optional(),
  items: z.array(adminOrderItemSchema).min(1).optional(),
});

export type CreateAdminOrderInput = z.infer<typeof createAdminOrderSchema>;
export type UpdateAdminOrderInput = z.infer<typeof updateAdminOrderSchema>;
