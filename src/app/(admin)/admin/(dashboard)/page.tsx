import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/utils";
import { cn, numeric } from "@/lib/classes";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/shop/StatusBadge";
import CustomerCell from "@/components/admin/CustomerCell";
import { Table, THead, TBody, Tr, Th, Td } from "@/components/ui";
import type { Order, CustomerProfile } from "@/types/db";

type RecentOrder = Pick<
  Order,
  | "id"
  | "user_id"
  | "order_number"
  | "customer_name"
  | "customer_email"
  | "customer_phone"
  | "total"
  | "status"
  | "payment_status"
  | "created_at"
>;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ data: orders }, { data: products }] = await Promise.all([
    supabase
      .from("orders")
      .select(
        "id, user_id, order_number, customer_name, customer_email, customer_phone, total, status, payment_status, created_at",
      )
      .order("created_at", { ascending: false }),
    supabase.from("products").select("id, stock"),
  ]);

  const orderList = (orders ?? []) as RecentOrder[];

  const userIds = [
    ...new Set(orderList.map((o) => o.user_id).filter(Boolean)),
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

  const revenue = orderList
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const pendingCount = orderList.filter((o) => o.status === "pending").length;
  const lowStockCount = (products ?? []).filter((p) => p.stock <= 5).length;
  const recent = orderList.slice(0, 6);

  const stats = [
    { label: "Revenue (paid)", value: formatPrice(revenue), icon: DollarSign },
    { label: "Total Orders", value: String(orderList.length), icon: ShoppingCart },
    { label: "Pending Orders", value: String(pendingCount), icon: Clock },
    { label: "Low Stock Items", value: String(lowStockCount), icon: AlertTriangle },
  ];

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-lg border border-glass-border bg-glass-bg p-4"
            >
              <div className="mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-md bg-gold/15 text-gold">
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </div>
              <div className={cn("text-xl font-semibold text-white sm:text-2xl", numeric)}>
                {stat.value}
              </div>
              <div className="text-xs text-white/50 sm:text-sm">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-white">Recent Orders</h2>
        <Link
          href="/admin/orders"
          className="text-sm text-gold transition-colors hover:text-gold-light"
        >
          View all
        </Link>
      </div>

      <div className="mt-3">
        {recent.length === 0 ? (
          <div className="rounded-lg border border-glass-border p-8 text-center text-white/50">
            No orders yet.
          </div>
        ) : (
          <Table minWidth="min-w-[560px]">
            <THead>
              <Tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th className="hidden sm:table-cell">Date</Th>
                <Th>Status</Th>
                <Th align="right">Total</Th>
              </Tr>
            </THead>
            <TBody>
              {recent.map((order) => (
                <Tr key={order.id}>
                  <Td className="font-medium text-gold">{order.order_number}</Td>
                  <Td>
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
                  </Td>
                  <Td className="hidden text-white/50 sm:table-cell">
                    {new Date(order.created_at).toLocaleDateString("en-PK")}
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      <OrderStatusBadge status={order.status} />
                      <PaymentStatusBadge status={order.payment_status} />
                    </div>
                  </Td>
                  <Td align="right" className={cn("font-medium text-white", numeric)}>
                    {formatPrice(order.total)}
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        )}
      </div>
    </div>
  );
}
