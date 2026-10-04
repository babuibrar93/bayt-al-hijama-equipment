import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required").max(160),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Please add a description").max(4000),
  price: z.number().nonnegative("Price must be 0 or more"),
  cost_price: z
    .number()
    .nonnegative("Cost must be 0 or more")
    .nullable()
    .optional(),
  stock: z.number().int().nonnegative("Stock must be 0 or more"),
  images: z.array(z.string().url()).default([]),
  features: z.array(z.string().min(1)).default([]),
  category_id: z.string().uuid().nullable().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productSchema>;
