import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPurchaseSchema } from "@/lib/validation/purchase";
import { generatePurchaseNumber } from "@/lib/admin/order-number";
import { applyStockIncrement } from "@/lib/admin/purchase-stock";

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

  const parsed = createPurchaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const db = createAdminClient();
  const subtotal = data.items.reduce(
    (sum, item) => sum + item.unitCost * item.quantity,
    0,
  );

  const { data: purchase, error } = await db
    .from("purchases")
    .insert({
      purchase_number: generatePurchaseNumber(),
      supplier_name: data.supplierName,
      supplier_phone: data.supplierPhone || null,
      status: data.status,
      subtotal,
      notes: data.notes || null,
      purchased_at: data.purchasedAt ?? new Date().toISOString(),
    })
    .select("id, purchase_number")
    .single();

  if (error || !purchase) {
    return NextResponse.json(
      { error: error?.message ?? "Could not create purchase" },
      { status: 500 },
    );
  }

  const lines = data.items.map((item) => ({
    purchase_id: purchase.id,
    product_id: item.productId ?? null,
    product_name: item.productName,
    unit_cost: item.unitCost,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await db.from("purchase_items").insert(lines);
  if (itemsError) {
    await db.from("purchases").delete().eq("id", purchase.id);
    return NextResponse.json(
      { error: itemsError.message },
      { status: 500 },
    );
  }

  if (data.status === "confirmed") {
    const stockResult = await applyStockIncrement(
      db,
      lines.map((l) => ({
        product_id: l.product_id,
        product_name: l.product_name,
        quantity: l.quantity,
      })),
    );
    if (stockResult.error) {
      await db.from("purchases").delete().eq("id", purchase.id);
      return NextResponse.json({ error: stockResult.error }, { status: 409 });
    }
  }

  if (data.updateProductCosts) {
    for (const item of data.items) {
      if (!item.productId) continue;
      await db
        .from("products")
        .update({ cost_price: item.unitCost })
        .eq("id", item.productId);
    }
  }

  return NextResponse.json({
    id: purchase.id,
    purchaseNumber: purchase.purchase_number,
  });
}
