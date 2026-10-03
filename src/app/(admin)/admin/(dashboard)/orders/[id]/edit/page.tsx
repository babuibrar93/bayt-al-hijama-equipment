import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrderForm from "@/components/admin/OrderForm";
import type { OrderWithItems, Product } from "@/types/db";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditOrderPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: orderData }, { data: productsData }] = await Promise.all([
    supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("products")
      .select("id, name, price, cost_price, stock")
      .order("name"),
  ]);

  if (!orderData) notFound();

  const order = orderData as unknown as OrderWithItems;
  const products = (productsData ?? []) as Pick<
    Product,
    "id" | "name" | "price" | "cost_price" | "stock"
  >[];

  // Keep line products available even if inactive.
  // While editing a non-cancelled order, qty already on this order counts as available.
  const reservedByProduct = new Map<string, number>();
  if (order.status !== "cancelled") {
    for (const item of order.items) {
      if (!item.product_id) continue;
      reservedByProduct.set(
        item.product_id,
        (reservedByProduct.get(item.product_id) ?? 0) + item.quantity,
      );
    }
  }

  const productMap = new Map(
    products.map((p) => [
      p.id,
      {
        ...p,
        stock: Number(p.stock) + (reservedByProduct.get(p.id) ?? 0),
      },
    ]),
  );
  for (const item of order.items) {
    if (item.product_id && !productMap.has(item.product_id)) {
      productMap.set(item.product_id, {
        id: item.product_id,
        name: item.product_name,
        price: Number(item.unit_price),
        cost_price:
          item.unit_cost == null ? null : Number(item.unit_cost),
        stock: reservedByProduct.get(item.product_id) ?? 0,
      });
    }
  }

  const lockItems =
    order.status === "shipped" || order.status === "delivered";

  const editableItems = order.items
    .filter((item): item is typeof item & { product_id: string } =>
      Boolean(item.product_id),
    )
    .map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
    }));

  if (editableItems.length === 0) {
    notFound();
  }

  const address = order.shipping_address;

  return (
    <OrderForm
      mode="edit"
      orderId={order.id}
      orderNumber={order.order_number}
      lockItems={lockItems}
      products={[...productMap.values()]}
      initial={{
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email ?? "",
        line1: address.line1,
        city: address.city,
        province: address.province,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        status: order.status,
        notes: order.notes ?? "",
        shippingFee:
          order.shipping_fee != null ? String(order.shipping_fee) : "",
        items: editableItems,
      }}
    />
  );
}
