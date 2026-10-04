import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { reportManualEntrySchema } from "@/lib/validation/report-manual";

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = reportManualEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const payload = {
    year: data.year,
    month: data.month,
    day: data.day,
    revenue: data.revenue,
    purchase_spend: data.purchaseSpend,
    gross_profit: data.grossProfit,
    order_count: data.orderCount,
    notes: data.notes?.trim() || null,
  };

  const db = createAdminClient();
  const { data: existing } = await db
    .from("report_manual_entries")
    .select("id")
    .eq("year", data.year)
    .eq("month", data.month)
    .eq("day", data.day)
    .maybeSingle();

  const write = existing?.id
    ? db
        .from("report_manual_entries")
        .update(payload)
        .eq("id", existing.id)
        .select("*")
        .single()
    : db.from("report_manual_entries").insert(payload).select("*").single();

  const { data: row, error } = await write;
  if (error || !row) {
    return NextResponse.json(
      { error: error?.message || "Save failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ item: row });
}
