import Link from "next/link";
import {
  AlertTriangle,
  Boxes,
  Clock,
  DollarSign,
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/utils";
import { cn, numeric } from "@/lib/classes";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/shop/StatusBadge";
import CustomerCell from "@/components/admin/CustomerCell";
import {
  Button,
  Table,
  THead,
  TBody,
  Tr,
  Th,
  Td,
  StatCard,
  StatGrid,
} from "@/components/ui";
import {
  currentKarachiYearMonth,
  karachiMonthBounds,
  monthLabelLong,
} from "@/lib/admin/dates";
import {
  fetchOrderListStats,
  fetchPeriodSalesStats,
  fetchProductCatalogStats,
} from "@/lib/admin/queries";
import type { CustomerProfile, Order } from "@/types/db";

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
  const { year, month } = currentKarachiYearMonth();
  const mtd = karachiMonthBounds(year, month);
  const monthName = monthLabelLong(month);

  const [{ data: recentOrders }, mtdStats, productStats, orderStats] =
    await Promise.all([
      supabase
        .from("orders")
        .select(
          "id, user_id, order_number, customer_name, customer_email, customer_phone, total, status, payment_status, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(8),
      fetchPeriodSalesStats(supabase, mtd.from, mtd.to),
      fetchProductCatalogStats(supabase),
      fetchOrderListStats(supabase),
    ]);

  const orderList = (recentOrders ?? []) as RecentOrder[];
  const lowStock = productStats.low;
  const outOfStock = productStats.out;
  const pendingCount = orderStats.pending;
  const unpaidCount = orderStats.unpaid;

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

  const attention = [
    {
      label: "Pending orders",
      value: pendingCount,
      href: "/admin/orders?status=pending",
      tone: "amber" as const,
    },
    {
      label: "Unpaid orders",
      value: unpaidCount,
      href: "/admin/orders?payment_status=unpaid",
      tone: "amber" as const,
    },
    {
      label: "Low stock",
      value: lowStock,
      href: "/admin/inventory?stock=low",
      tone: "amber" as const,
    },
    {
      label: "Out of stock",
      value: outOfStock,
      href: "/admin/inventory?stock=out",
      tone: "red" as const,
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <h1 className="min-w-0 font-body text-xl font-normal text-white sm:text-2xl lg:text-3xl">
          Dashboard
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            href="/admin/orders/new"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            aria-label="Create order"
            title="Create order"
            className="h-9 w-full justify-center gap-1.5 px-3.5 sm:w-auto"
          >
            <span>Create order</span>
          </Button>
          <Button
            href="/admin/reports"
            size="sm"
            variant="ghost"
            className="whitespace-nowrap"
          >
            Reports
          </Button>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium uppercase tracking-wide text-white/40">
            {monthName} {year} overview
          </h2>
          <Link
            href="/admin/reports"
            className="text-sm text-gold transition-colors hover:text-gold-light"
          >
            View reports
          </Link>
        </div>
        <StatGrid className="mb-0">
          <StatCard
            label="Revenue (paid)"
            value={formatPrice(mtdStats.paidRevenue)}
            icon={DollarSign}
            hint="Month to date · paid orders"
          />
          <StatCard
            label="Gross profit"
            value={formatPrice(mtdStats.paidProfit)}
            icon={TrendingUp}
            hint="Paid sales − COGS"
          />
          <StatCard
            label="Orders"
            value={String(mtdStats.orderCount)}
            icon={ShoppingBag}
            hint="Non-cancelled this month"
          />
          <StatCard
            label="Product cost"
            value={formatPrice(mtdStats.paidCogs)}
            icon={Wallet}
            hint="Paid sales · product cost"
          />
        </StatGrid>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-white/40">
          Operations
        </h2>
        <StatGrid className="mb-0">
          <StatCard
            label="Pending orders"
            value={String(pendingCount)}
            icon={Clock}
          />
          <StatCard
            label="Unpaid orders"
            value={String(unpaidCount)}
            icon={AlertTriangle}
          />
          <StatCard
            label="Products"
            value={String(productStats.total)}
            icon={Package}
          />
          <StatCard
            label="Low stock"
            value={String(lowStock)}
            icon={Boxes}
            hint="≤ 5 units"
          />
        </StatGrid>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-body text-base text-white sm:text-lg">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm text-gold transition-colors hover:text-gold-light"
            >
              View all
            </Link>
          </div>

          {orderList.length === 0 ? (
            <div className="rounded-lg border border-glass-border bg-glass-bg px-4 py-8 text-center text-sm text-white/50 sm:p-10">
              No orders yet.{" "}
              <Link
                href="/admin/orders/new"
                className="text-gold hover:text-gold-light"
              >
                Create your first order
              </Link>
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
                {orderList.map((order) => (
                  <Tr key={order.id}>
                    <Td className="font-medium text-gold">
                      <Link href={`/admin/orders/${order.id}`}>
                        {order.order_number}
                      </Link>
                    </Td>
                    <Td>
                      <CustomerCell
                        name={order.customer_name}
                        email={order.customer_email}
                        phone={order.customer_phone}
                        customer={
                          order.user_id
                            ? (customerMap.get(order.user_id) ?? null)
                            : null
                        }
                      />
                    </Td>
                    <Td className="hidden text-white/50 sm:table-cell">
                      {new Date(order.created_at).toLocaleDateString("en-PK", {
                        timeZone: "Asia/Karachi",
                      })}
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1.5">
                        <OrderStatusBadge status={order.status} />
                        <PaymentStatusBadge status={order.payment_status} />
                      </div>
                    </Td>
                    <Td
                      align="right"
                      className={cn("font-medium text-white", numeric)}
                    >
                      {formatPrice(order.total)}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          )}
        </section>

        <aside className="space-y-3 sm:space-y-4">
          <section className="overflow-hidden rounded-lg border border-glass-border bg-glass-bg">
            <h2 className="bg-green-mid px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white sm:px-4 sm:py-2.5">
              Needs attention
            </h2>
            <div className="p-2 sm:p-3">
              {attention.length === 0 ? (
                <p className="px-1 py-3 text-xs text-white/50 sm:text-sm">
                  Nothing urgent right now.
                </p>
              ) : (
                <ul className="space-y-1">
                  {attention.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between gap-3 rounded-md px-2 py-2 text-xs transition-colors hover:bg-white/5 sm:py-2.5 sm:text-sm"
                      >
                        <span className="text-white/70">{item.label}</span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-semibold",
                            numeric,
                            item.tone === "red" &&
                              "bg-red-500/15 text-red-300",
                            item.tone === "amber" &&
                              "bg-amber-500/15 text-amber-200",
                          )}
                        >
                          {item.value}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-glass-border bg-glass-bg">
            <h2 className="bg-green-mid px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white sm:px-4 sm:py-2.5">
              Quick links
            </h2>
            <div className="flex flex-col gap-2 p-2 sm:p-3">
              <Button href="/admin/orders" fullWidth variant="subtle" size="sm">
                All orders
              </Button>
              <Button
                href="/admin/inventory"
                fullWidth
                variant="subtle"
                size="sm"
              >
                Inventory
              </Button>
              <Button
                href="/admin/products"
                fullWidth
                variant="subtle"
                size="sm"
              >
                Products
              </Button>
              <Button
                href="/admin/reports"
                fullWidth
                variant="subtle"
                size="sm"
              >
                Reports
              </Button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
