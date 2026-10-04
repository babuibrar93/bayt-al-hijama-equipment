import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateAdminOrderSchema } from "@/lib/validation/admin-order";
import {
  currentKarachiDateKey,
  karachiDateWithTimeIso,
  toKarachiDateKey,
} from "@/lib/admin/dates";
import type { ShippingAddress } from "@/types/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const LOCKED_STATUSES = new Set(["shipped", "delivered"]);

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

  // Accept camelCase (new forms) and snake_case (OrderControls).
  const raw = (body ?? {}) as Record<string, unknown>;
  const normalized = {
    ...raw,
    paymentStatus: raw.paymentStatus ?? raw.payment_status,
    customerName: raw.customerName ?? raw.customer_name,
    customerPhone: raw.customerPhone ?? raw.customer_phone,
    customerEmail: raw.customerEmail ?? raw.customer_email,
    paymentMethod: raw.paymentMethod ?? raw.payment_method,
    shippingFee: raw.shippingFee ?? raw.shipping_fee,
  };

  const parsed = updateAdminOrderSchema.safeParse(normalized);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const db = createAdminClient();

  const { data: existing, error: fetchError } = await db
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (data.items && LOCKED_STATUSES.has(existing.status)) {
    return NextResponse.json(
      { error: "Cannot edit line items after order is shipped or delivered" },
      { status: 409 },
    );
  }

  const updates: Record<string, unknown> = {};
  if (data.customerName != null) updates.customer_name = data.customerName;
  if (data.customerPhone != null) updates.customer_phone = data.customerPhone;
  if (data.customerEmail !== undefined) {
    updates.customer_email = data.customerEmail;
  }
  if (data.paymentMethod != null) updates.payment_method = data.paymentMethod;
  if (data.paymentStatus != null) updates.payment_status = data.paymentStatus;
  if (data.status != null) updates.status = data.status;
  if (data.shippingFee != null) updates.shipping_fee = data.shippingFee;
  if (data.notes !== undefined) updates.notes = data.notes;
  if (data.orderDate) {
    const currentKey = toKarachiDateKey(existing.created_at);
    if (data.orderDate !== currentKey) {
      updates.created_at =
        data.orderDate === currentKarachiDateKey()
          ? new Date().toISOString()
          : karachiDateWithTimeIso(data.orderDate, new Date(existing.created_at));
    }
  }
  if (data.address) {
    const shippingAddress: ShippingAddress = {
      line1: data.address.line1,
      line2: data.address.line2 || undefined,
      city: data.address.city,
      province: data.address.province,
      postalCode: data.address.postalCode || undefined,
    };
    updates.shipping_address = shippingAddress;
  }

  if (data.items) {
    const oldItems = (existing.items ?? []) as {
      product_id: string | null;
      quantity: number;
      unit_cost: number | null;
    }[];

    // Qty already reserved on this order should count as available while editing.
    // Cancelled orders already restored stock via trigger — don't credit twice.
    const alreadyRestocked = existing.status === "cancelled";
    const reservedByProduct = new Map<string, number>();
    if (!alreadyRestocked) {
      for (const old of oldItems) {
        if (!old.product_id) continue;
        reservedByProduct.set(
          old.product_id,
          (reservedByProduct.get(old.product_id) ?? 0) + old.quantity,
        );
      }
    }

    const productIds = [
      ...new Set([
        ...data.items.map((i) => i.productId),
        ...reservedByProduct.keys(),
      ]),
    ];
    const { data: products, error: productError } = await db
      .from("products")
      .select("id, name, price, cost_price, stock")
      .in("id", productIds);

    if (productError || !products) {
      return NextResponse.json(
        { error: "Could not verify products" },
        { status: 500 },
      );
    }

    const availableByProduct = new Map(
      products.map((p) => [
        p.id,
        Number(p.stock) + (reservedByProduct.get(p.id) ?? 0),
      ]),
    );

    // Validate against available stock before mutating rows.
    const neededByProduct = new Map<string, number>();
    for (const item of data.items) {
      neededByProduct.set(
        item.productId,
        (neededByProduct.get(item.productId) ?? 0) + item.quantity,
      );
    }
    for (const [productId, needed] of neededByProduct) {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        return NextResponse.json(
          { error: "One or more products were not found" },
          { status: 409 },
        );
      }
      const available = availableByProduct.get(productId) ?? 0;
      if (available < needed) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name} (need ${needed}, available ${available})`,
          },
          { status: 409 },
        );
      }
    }

    // Return reserved qty to shelf, then replace lines (insert trigger decrements again).
    if (!alreadyRestocked) {
      for (const old of oldItems) {
        if (!old.product_id) continue;
        const { data: product } = await db
          .from("products")
          .select("stock")
          .eq("id", old.product_id)
          .maybeSingle();
        if (product) {
          await db
            .from("products")
            .update({ stock: Number(product.stock) + old.quantity })
            .eq("id", old.product_id);
        }
      }
    }

    await db.from("order_items").delete().eq("order_id", id);

    const lineItems = [];
    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: "One or more products were not found" },
          { status: 409 },
        );
      }
      const prev = oldItems.find((o) => o.product_id === item.productId);
      lineItems.push({
        order_id: id,
        product_id: product.id,
        product_name: product.name,
        unit_price:
          item.unitPrice != null ? item.unitPrice : Number(product.price),
        unit_cost:
          prev?.unit_cost != null
            ? Number(prev.unit_cost)
            : product.cost_price == null
              ? null
              : Number(product.cost_price),
        quantity: item.quantity,
      });
    }

    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0,
    );
    const shippingFee =
      data.shippingFee != null
        ? data.shippingFee
        : Number(existing.shipping_fee);
    updates.subtotal = subtotal;
    updates.shipping_fee = shippingFee;
    updates.total = subtotal + shippingFee;

    const { error: itemsError } = await db.from("order_items").insert(lineItems);
    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message },
        { status: 500 },
      );
    }
  } else if (data.shippingFee != null) {
    updates.total = Number(existing.subtotal) + data.shippingFee;
  }

  if (Object.keys(updates).length > 0) {
    const { error } = await db.from("orders").update(updates).eq("id", id);
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
    .from("orders")
    .select("status, payment_status")
    .eq("id", id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Cancel first so stock is restored, then hard-delete the order row.
  if (existing.status !== "cancelled") {
    const cancelUpdate: Record<string, string> = { status: "cancelled" };
    if (existing.payment_status === "paid") {
      cancelUpdate.payment_status = "refunded";
    }
    const { error: cancelError } = await db
      .from("orders")
      .update(cancelUpdate)
      .eq("id", id);
    if (cancelError) {
      return NextResponse.json({ error: cancelError.message }, { status: 400 });
    }
  }

  const { error } = await db.from("orders").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
