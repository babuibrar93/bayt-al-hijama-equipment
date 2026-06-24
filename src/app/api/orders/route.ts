import { NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/validation/order";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "@/constants/payment";
import {
  sendOrderConfirmation,
  sendAdminOrderAlert,
  type OrderEmailData,
} from "@/lib/email/brevo";
import type { ShippingAddress } from "@/types/db";

function generateOrderNumber(): string {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BAH-${ymd}-${random}`;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Store is not configured yet. Please set up Supabase." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const admin = createAdminClient();

  // Fetch authoritative product data for the requested items.
  const productIds = data.items.map((i) => i.productId);
  const { data: products, error: productError } = await admin
    .from("products")
    .select("id, name, price, stock, is_active")
    .in("id", productIds);

  if (productError || !products) {
    return NextResponse.json(
      { error: "Could not verify products" },
      { status: 500 },
    );
  }

  // Build order line items from server-side prices, validating stock.
  const lineItems: {
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
  }[] = [];

  for (const item of data.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.is_active) {
      return NextResponse.json(
        { error: "One or more products are unavailable" },
        { status: 409 },
      );
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for ${product.name}` },
        { status: 409 },
      );
    }
    lineItems.push({
      product_id: product.id,
      product_name: product.name,
      unit_price: Number(product.price),
      quantity: item.quantity,
    });
  }

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0,
  );
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  // Associate the order with the logged-in user, if any.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const shippingAddress: ShippingAddress = {
    line1: data.address.line1,
    line2: data.address.line2 || undefined,
    city: data.address.city,
    province: data.address.province,
    postalCode: data.address.postalCode || undefined,
  };

  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      order_number: orderNumber,
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      customer_email: data.customerEmail || null,
      shipping_address: shippingAddress,
      payment_method: data.paymentMethod,
      subtotal,
      shipping_fee: shippingFee,
      total,
      notes: data.notes || null,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Could not create order" },
      { status: 500 },
    );
  }

  const { error: itemsError } = await admin.from("order_items").insert(
    lineItems.map((item) => ({ ...item, order_id: order.id })),
  );

  if (itemsError) {
    // Roll back the order so we don't leave an empty order behind.
    await admin.from("orders").delete().eq("id", order.id);
    return NextResponse.json(
      { error: "Could not save order items" },
      { status: 500 },
    );
  }

  // Best-effort transactional emails (never block order success on failure).
  const emailData: OrderEmailData = {
    orderNumber: order.order_number,
    customerName: data.customerName,
    customerEmail: data.customerEmail || "",
    paymentMethod: data.paymentMethod,
    items: lineItems.map((i) => ({
      name: i.product_name,
      quantity: i.quantity,
      unitPrice: i.unit_price,
    })),
    subtotal,
    shippingFee,
    total,
  };

  await Promise.allSettled([
    data.customerEmail ? sendOrderConfirmation(emailData) : Promise.resolve(),
    sendAdminOrderAlert(emailData),
  ]);

  return NextResponse.json({
    orderNumber: order.order_number,
    subtotal,
    shippingFee,
    total,
  });
}
