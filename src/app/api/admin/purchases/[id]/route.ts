import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { updatePurchaseSchema } from "@/lib/validation/purchase";
import {
  applyStockDecrement,
  applyStockDeltas,
  applyStockIncrement,
} from "@/lib/admin/purchase-stock";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = updatePurchaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const db = createAdminClient();

  const { data: existing, error: fetchError } = await db
    .from("purchases")
    .select("*, items:purchase_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  }

  const oldStatus = existing.status as string;
  const newStatus = data.status ?? oldStatus;
  const oldItems = (existing.items ?? []) as {
    product_id: string | null;
    product_name: string;
    unit_cost: number;
    quantity: number;
  }[];

  if (oldStatus === "confirmed" && newStatus === "confirmed" && data.status === "confirmed") {
    // no-op status
  }

  if (oldStatus === "confirmed" && newStatus === "confirmed" && !data.items) {
    // status confirm again
  }

  if (oldStatus === "cancelled" && newStatus === "confirmed") {
    return NextResponse.json(
      { error: "Cannot re-confirm a cancelled purchase" },
      { status: 409 },
    );
  }

  // Status transitions affecting stock
  if (oldStatus !== "confirmed" && newStatus === "confirmed") {
    const lines = data.items
      ? data.items.map((i) => ({
          product_id: i.productId ?? null,
          product_name: i.productName,
          quantity: i.quantity,
        }))
      : oldItems.map((i) => ({
          product_id: i.product_id,
          product_name: i.product_name,
          quantity: i.quantity,
        }));
    const result = await applyStockIncrement(db, lines);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
  }

  if (oldStatus === "confirmed" && newStatus === "cancelled") {
    const result = await applyStockDecrement(
      db,
      oldItems.map((i) => ({
        product_id: i.product_id,
        product_name: i.product_name,
        quantity: i.quantity,
      })),
    );
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
  }

  if (data.items) {
    if (oldStatus === "confirmed" && newStatus === "confirmed") {
      const oldMap = new Map<string, number>();
      for (const item of oldItems) {
        if (!item.product_id) continue;
        oldMap.set(
          item.product_id,
          (oldMap.get(item.product_id) ?? 0) + item.quantity,
        );
      }
      const newMap = new Map<string, { qty: number; name: string }>();
      for (const item of data.items) {
        if (!item.productId) continue;
        const prev = newMap.get(item.productId);
        newMap.set(item.productId, {
          qty: (prev?.qty ?? 0) + item.quantity,
          name: item.productName,
        });
      }
      const deltas: { productId: string; productName: string; delta: number }[] =
        [];
      const ids = new Set([...oldMap.keys(), ...newMap.keys()]);
      for (const productId of ids) {
        const oldQty = oldMap.get(productId) ?? 0;
        const next = newMap.get(productId);
        const newQty = next?.qty ?? 0;
        deltas.push({
          productId,
          productName: next?.name ?? "Product",
          delta: newQty - oldQty,
        });
      }
      const result = await applyStockDeltas(db, deltas);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 409 });
      }
    }

    await db.from("purchase_items").delete().eq("purchase_id", id);
    const lines = data.items.map((item) => ({
      purchase_id: id,
      product_id: item.productId ?? null,
      product_name: item.productName,
      unit_cost: item.unitCost,
      quantity: item.quantity,
    }));
    const { error: itemsError } = await db.from("purchase_items").insert(lines);
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
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
  }

  const updates: Record<string, unknown> = {};
  if (data.supplierName != null) updates.supplier_name = data.supplierName;
  if (data.supplierPhone !== undefined) {
    updates.supplier_phone = data.supplierPhone;
  }
  if (data.notes !== undefined) updates.notes = data.notes;
  if (data.purchasedAt != null) updates.purchased_at = data.purchasedAt;
  if (data.status != null) updates.status = data.status;
  if (data.items) {
    updates.subtotal = data.items.reduce(
      (sum, item) => sum + item.unitCost * item.quantity,
      0,
    );
  }

  if (Object.keys(updates).length > 0) {
    const { error } = await db.from("purchases").update(updates).eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = createAdminClient();

  const { data: existing } = await db
    .from("purchases")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  }

  if (existing.status === "confirmed") {
    return NextResponse.json(
      { error: "Cancel the purchase before deleting" },
      { status: 409 },
    );
  }

  const { error } = await db.from("purchases").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
