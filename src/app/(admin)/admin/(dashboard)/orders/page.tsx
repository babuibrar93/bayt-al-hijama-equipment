import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/utils";
import { getPaymentOption } from "@/constants/payment";
import { cn, numeric } from "@/lib/classes";
import OrderControls from "@/components/admin/OrderControls";
import CustomerCell from "@/components/admin/CustomerCell";
import type { OrderWithItems, CustomerProfile } from "@/types/db";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as unknown as OrderWithItems[];

  const userIds = [
    ...new Set(orders.map((o) => o.user_id).filter(Boolean)),
  ] as string[];
  const customerMap = new Map<string, CustomerProfile>();
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, email")
      .in("id", userIds);
    (profiles ?? []).forEach((p) =>
      customerMap.set(p.id, p as CustomerProfile),
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-normal text-white sm:text-3xl">
        Orders
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-glass-border bg-glass-bg p-10 text-center text-white/60">
          No orders yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-lg border border-glass-border bg-glass-bg p-4 sm:p-5"
            >
              <div className="flex flex-col gap-3 border-b border-glass-border pb-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className={cn("text-base font-semibold text-gold", numeric)}>
                      {order.order_number}
                    </span>
                    <span className="text-xs text-white/40">
                      {new Date(order.created_at).toLocaleString("en-PK")}
                    </span>
                  </div>
                  <CustomerCell
                    name={order.customer_name}
                    email={order.customer_email}
                    phone={order.customer_phone}
                    customer={
                      order.user_id
                        ? customerMap.get(order.user_id) ?? null
                        : null
                    }
                  />
                </div>
                <OrderControls
                  orderId={order.id}
                  status={order.status}
                  paymentStatus={order.payment_status}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-[1fr_280px]">
                <div>
                  <ul className="flex flex-col gap-2" role="list">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between gap-3 text-sm text-white/75"
                      >
                        <span>
                          {item.product_name}
                          <span className="text-white/40"> x{item.quantity}</span>
                        </span>
                        <span className={cn("shrink-0", numeric)}>
                          {formatPrice(item.unit_price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {order.notes && (
                    <p className="mt-3 rounded-md bg-black/30 p-3 text-sm text-white/60">
                      Note: {order.notes}
                    </p>
                  )}
                </div>

                <div className="rounded-md bg-black/20 p-4 text-sm">
                  <p className="mb-2 font-medium text-white/80">Shipping</p>
                  <address className="not-italic text-white/60">
                    {order.shipping_address.line1}
                    {order.shipping_address.line2 && (
                      <>
                        <br />
                        {order.shipping_address.line2}
                      </>
                    )}
                    <br />
                    {order.shipping_address.city}, {order.shipping_address.province}
                    {order.shipping_address.postalCode
                      ? ` ${order.shipping_address.postalCode}`
                      : ""}
                  </address>
                  <div className="mt-3 flex justify-between border-t border-glass-border pt-3 text-white/70">
                    <span>
                      {getPaymentOption(order.payment_method)?.label ??
                        order.payment_method}
                    </span>
                    <span className={cn("text-base font-semibold text-white", numeric)}>
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
