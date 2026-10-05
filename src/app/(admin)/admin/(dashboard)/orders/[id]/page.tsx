import { notFound } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  Package,
  Truck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/utils";
import { cn, numeric } from "@/lib/classes";
import {
  Badge,
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
import OrderActionsPanel from "@/components/admin/OrderActionsPanel";
import { computeOrderProfit } from "@/lib/admin/profit";
import { getPaymentOption } from "@/constants/payment";
import type { OrderWithItems } from "@/types/db";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const order = data as unknown as OrderWithItems;
  const profit = computeOrderProfit(order.items);
  const payment = getPaymentOption(order.payment_method);
  const address = order.shipping_address;
  const notes = order.notes?.trim() || "";

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:mb-6 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Button
            href="/admin/orders"
            variant="subtle"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="shrink-0"
          >
            Back
          </Button>
          <div className="min-w-0">
            <h1
              className={cn(
                "truncate font-body text-xl text-gold sm:text-2xl lg:text-3xl",
                numeric,
              )}
            >
              {order.order_number}
            </h1>
            <p className="mt-0.5 text-xs text-white/50 sm:text-sm">
              {new Date(order.created_at).toLocaleString("en-PK", {
                timeZone: "Asia/Karachi",
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Badge tone="neutral">{order.status}</Badge>
          <Badge tone={order.payment_status === "paid" ? "green" : "neutral"}>
            {order.payment_status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4 sm:space-y-6">
          <StatGrid columns={2} className="mb-0">
            <StatCard
              label="Total charged"
              value={formatPrice(Number(order.total))}
              icon={Wallet}
            />
            <StatCard
              label="Cost of goods sold"
              value={formatPrice(profit.cogs)}
              icon={Package}
            />
            <StatCard
              label="Goods revenue"
              value={formatPrice(profit.goodsRevenue)}
              icon={DollarSign}
            />
            <StatCard
              label="Shipping fee"
              value={formatPrice(Number(order.shipping_fee))}
              icon={Truck}
            />

            <StatCard
              label="Order profit"
              value={formatPrice(profit.profit)}
              icon={TrendingUp}
            />
          </StatGrid>

          {profit.missingCostLines > 0 && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {profit.missingCostLines} line(s) missing unit cost — profit may
              be overstated.
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            <section className="overflow-hidden rounded-lg border border-glass-border bg-glass-bg">
              <h2 className="bg-green-mid px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white sm:px-4 sm:py-2.5">
                Customer
              </h2>
              <div className="p-3 sm:p-4">
                <dl className="space-y-2.5 text-xs sm:space-y-3 sm:text-sm">
                  <div>
                    <dt className="text-white/45">Name</dt>
                    <dd className="mt-0.5 text-white">{order.customer_name}</dd>
                  </div>
                  <div>
                    <dt className="text-white/45">Phone</dt>
                    <dd className={cn("mt-0.5 text-white", numeric)}>
                      {order.customer_phone}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/45">Email</dt>
                    <dd className="mt-0.5 break-all text-white">
                      {order.customer_email?.trim() || "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-glass-border bg-glass-bg">
              <h2 className="bg-green-mid px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white sm:px-4 sm:py-2.5">
                Shipping
              </h2>
              <div className="p-3 sm:p-4">
                <dl className="space-y-2.5 text-xs sm:space-y-3 sm:text-sm">
                  <div>
                    <dt className="text-white/45">Address</dt>
                    <dd className="mt-0.5 text-white">
                      {address.line1}
                      {address.line2 ? (
                        <>
                          <br />
                          {address.line2}
                        </>
                      ) : null}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/45">City</dt>
                    <dd className="mt-0.5 text-white">{address.city || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-white/45">Province</dt>
                    <dd className="mt-0.5 text-white">
                      {address.province || "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-glass-border bg-glass-bg sm:col-span-2 lg:col-span-1">
              <h2 className="bg-green-mid px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white sm:px-4 sm:py-2.5">
                Payment
              </h2>
              <div className="p-3 sm:p-4">
                <dl className="space-y-2.5 text-xs sm:space-y-3 sm:text-sm">
                  <div>
                    <dt className="text-white/45">Method</dt>
                    <dd className="mt-0.5 text-white">
                      {payment?.label ?? order.payment_method}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/45">Payment status</dt>
                    <dd className="mt-0.5 capitalize text-white">
                      {order.payment_status}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/45">Order status</dt>
                    <dd className="mt-0.5 capitalize text-white">
                      {order.status}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          </div>

          <section className="overflow-hidden rounded-lg border border-glass-border bg-glass-bg">
            <h2 className="bg-green-mid px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white sm:px-4 sm:py-2.5">
              Notes
            </h2>
            <div className="p-3 sm:p-4">
              <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-white/85 sm:text-sm">
                {notes || "—"}
              </p>
            </div>
          </section>

          <Table minWidth="min-w-[560px]">
            <THead>
              <Tr>
                <Th>Item</Th>
                <Th align="right">Qty</Th>
                <Th align="right">Sell</Th>
                <Th align="right">Cost</Th>
                <Th align="right">Line profit</Th>
              </Tr>
            </THead>
            <TBody>
              {order.items.map((item) => {
                const cost =
                  item.unit_cost == null ? 0 : Number(item.unit_cost);
                const lineProfit =
                  (Number(item.unit_price) - cost) * item.quantity;
                return (
                  <Tr key={item.id}>
                    <Td className="text-white">{item.product_name}</Td>
                    <Td align="right" className={numeric}>
                      {item.quantity}
                    </Td>
                    <Td align="right" className={numeric}>
                      {formatPrice(Number(item.unit_price))}
                    </Td>
                    <Td align="right" className={`text-white/60 ${numeric}`}>
                      {item.unit_cost == null
                        ? "—"
                        : formatPrice(Number(item.unit_cost))}
                    </Td>
                    <Td align="right" className={`text-gold ${numeric}`}>
                      {formatPrice(lineProfit)}
                    </Td>
                  </Tr>
                );
              })}
            </TBody>
          </Table>
        </div>

        <OrderActionsPanel order={order} />
      </div>
    </div>
  );
}
