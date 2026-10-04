import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAdminOrderSchema } from "@/lib/validation/admin-order";
import { generateOrderNumber } from "@/lib/admin/order-number";
import {
  currentKarachiDateKey,
  karachiDateWithTimeIso,
} from "@/lib/admin/dates";
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "@/constants/payment";
import type { ShippingAddress } from "@/types/db";

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

  const parsed = createAdminOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const db = createAdminClient();
  const productIds = data.items.map((i) => i.productId);

  const { data: products, error: productError } = await db
    .from("products")
    .select("id, name, price, cost_price, stock, is_active")
    .in("id", productIds);

  if (productError || !products) {
    return NextResponse.json(
      { error: "Could not verify products" },
      { status: 500 },
    );
  }

  const lineItems: {
    product_id: string;
    product_name: string;
    unit_price: number;
    unit_cost: number | null;
    quantity: number;
  }[] = [];

  for (const item of data.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json(
        { error: "One or more products were not found" },
        { status: 409 },
      );
    }
    if (data.status !== "cancelled" && product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for ${product.name}` },
        { status: 409 },
      );
    }
    lineItems.push({
      product_id: product.id,
      product_name: product.name,
      unit_price:
        item.unitPrice != null ? item.unitPrice : Number(product.price),
      unit_cost:
        product.cost_price == null ? null : Number(product.cost_price),
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
      : subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const shippingAddress: ShippingAddress = {
    line1: data.address.line1,
    line2: data.address.line2 || undefined,
    city: data.address.city,
    province: data.address.province,
    postalCode: data.address.postalCode || undefined,
  };

  const orderNumber = generateOrderNumber();
  const orderDate = data.orderDate || currentKarachiDateKey();
  const createdAt =
    orderDate === currentKarachiDateKey()
      ? new Date().toISOString()
      : karachiDateWithTimeIso(orderDate);

  const { data: order, error: orderError } = await db
    .from("orders")
    .insert({
      user_id: null,
      order_number: orderNumber,
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      customer_email: data.customerEmail || null,
      shipping_address: shippingAddress,
      payment_method: data.paymentMethod,
      payment_status: data.paymentStatus,
      status: data.status,
      subtotal,
      shipping_fee: shippingFee,
      total,
      notes: data.notes || null,
      created_at: createdAt,
      updated_at: createdAt,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message ?? "Could not create order" },
      { status: 500 },
    );
  }

  const { error: itemsError } = await db.from("order_items").insert(
    lineItems.map((item) => ({ ...item, order_id: order.id })),
  );

  if (itemsError) {
    await db.from("orders").delete().eq("id", order.id);
    return NextResponse.json(
      { error: "Could not save order items" },
      { status: 500 },
    );
  }

  return NextResponse.json({ id: order.id, orderNumber: order.order_number });
}
