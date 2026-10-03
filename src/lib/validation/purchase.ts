import { z } from "zod";

export const purchaseItemSchema = z.object({
  productId: z.string().uuid().nullable().optional(),
  productName: z.string().min(1).max(200),
  unitCost: z.number().nonnegative(),
  quantity: z.number().int().positive(),
});

export const createPurchaseSchema = z.object({
  supplierName: z.string().min(1).max(160),
  supplierPhone: z.string().max(40).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  purchasedAt: z.string().datetime().optional(),
  status: z.enum(["draft", "confirmed"]).default("draft"),
  items: z.array(purchaseItemSchema).min(1),
  updateProductCosts: z.boolean().optional().default(false),
});

export const updatePurchaseSchema = z.object({
  supplierName: z.string().min(1).max(160).optional(),
  supplierPhone: z.string().max(40).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  purchasedAt: z.string().datetime().optional(),
  status: z.enum(["draft", "confirmed", "cancelled"]).optional(),
  items: z.array(purchaseItemSchema).min(1).optional(),
  updateProductCosts: z.boolean().optional().default(false),
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;
export type UpdatePurchaseInput = z.infer<typeof updatePurchaseSchema>;
