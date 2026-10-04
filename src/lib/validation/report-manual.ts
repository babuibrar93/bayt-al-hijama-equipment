import { z } from "zod";

export const reportManualEntrySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  /** Day-level only (1–31). */
  day: z.coerce.number().int().min(1).max(31),
  revenue: z.coerce.number().min(0),
  purchaseSpend: z.coerce.number().min(0),
  grossProfit: z.coerce.number(),
  orderCount: z.coerce.number().int().min(0).max(100000).default(0),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ReportManualEntryInput = z.infer<typeof reportManualEntrySchema>;
