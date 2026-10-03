import Link from "next/link";
import { Suspense } from "react";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/utils";
import { numeric } from "@/lib/classes";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import type { FilterField } from "@/components/admin/AdminFilterBar";
import PeriodBreadcrumb from "@/components/admin/PeriodBreadcrumb";
import { computeOrderProfit } from "@/lib/admin/profit";
import {
  currentKarachiYearMonth,
  formatKarachiDayLabel,
  karachiDayKeysInMonth,
  karachiMonthBounds,
  karachiYearBounds,
  monthLabel,
  monthLabelLong,
  padDay,
  toKarachiDateKey,
} from "@/lib/admin/dates";
import {
  Table,
  THead,
  TBody,
  Tr,
  Th,
  Td,
  StatCard,
  StatGrid,
} from "@/components/ui";
import type { OrderWithItems, Purchase } from "@/types/db";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function param(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : "";
}

function inBounds(iso: string, from: string, to: string): boolean {
  const t = new Date(iso).getTime();
  return t >= new Date(from).getTime() && t < new Date(to).getTime();
}

function summarizeOrders(orders: OrderWithItems[]) {
  let revenue = 0;
  let cogs = 0;
  let missing = 0;
  for (const order of orders) {
    revenue += Number(order.total);
    const profit = computeOrderProfit(order.items);
    cogs += profit.cogs;
    missing += profit.missingCostLines;
  }
  return {
    revenue,
    cogs,
    grossProfit: revenue - cogs,
    missing,
    orderCount: orders.length,
  };
}

export default async function AdminReportsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { year: defaultYear } = currentKarachiYearMonth();
  const year = Number(param(sp.year) || defaultYear) || defaultYear;
  const monthRaw = param(sp.month);
  const dayRaw = param(sp.day);
  const month =
    monthRaw && Number(monthRaw) >= 1 && Number(monthRaw) <= 12
      ? Number(monthRaw)
      : null;
  const day =
    month && dayRaw && Number(dayRaw) >= 1 && Number(dayRaw) <= 31
      ? Number(dayRaw)
      : null;
  const payment = param(sp.payment) || "paid";
  const q = param(sp.q).trim();

  const level = day ? "day" : month ? "month" : "year";

  const supabase = await createClient();
  const yearBounds = karachiYearBounds(year);

  let ordersQuery = supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_phone, total, payment_status, status, created_at, items:order_items(unit_price, unit_cost, quantity)",
    )
    .gte("created_at", yearBounds.from)
    .lt("created_at", yearBounds.to)
    .neq("status", "cancelled");

  if (payment === "paid") {
    ordersQuery = ordersQuery.eq("payment_status", "paid");
  } else {
    ordersQuery = ordersQuery.neq("payment_status", "refunded");
  }

  const [{ data: ordersData }, { data: purchasesData }] = await Promise.all([
    ordersQuery,
    supabase
      .from("purchases")
      .select("id, subtotal, purchased_at")
      .eq("status", "confirmed")
      .gte("purchased_at", yearBounds.from)
      .lt("purchased_at", yearBounds.to),
  ]);

  const orders = (ordersData ?? []) as unknown as OrderWithItems[];

  const purchases = (purchasesData ?? []) as Purchase[];

  const months = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const bounds = karachiMonthBounds(year, m);
    const monthOrders = orders.filter((o) =>
      inBounds(o.created_at, bounds.from, bounds.to),
    );
    const monthPurchases = purchases.filter((p) =>
      inBounds(p.purchased_at, bounds.from, bounds.to),
    );
    const summary = summarizeOrders(monthOrders);
    const purchaseSpend = monthPurchases.reduce(
      (sum, p) => sum + Number(p.subtotal),
      0,
    );
    return {
      month: m,
      label: monthLabelLong(m),
      shortLabel: monthLabel(m),
      ...summary,
      purchaseSpend,
      netCash: summary.revenue - purchaseSpend,
    };
  });

  const yearTotals = months.reduce(
    (acc, m) => ({
      revenue: acc.revenue + m.revenue,
      cogs: acc.cogs + m.cogs,
      grossProfit: acc.grossProfit + m.grossProfit,
      purchaseSpend: acc.purchaseSpend + m.purchaseSpend,
      netCash: acc.netCash + m.netCash,
      missing: acc.missing + m.missing,
      orderCount: acc.orderCount + m.orderCount,
    }),
    {
      revenue: 0,
      cogs: 0,
      grossProfit: 0,
      purchaseSpend: 0,
      netCash: 0,
      missing: 0,
      orderCount: 0,
    },
  );

  const monthMeta = month ? months.find((m) => m.month === month) : null;

  const dayRows =
    month != null
      ? karachiDayKeysInMonth(year, month).map((key) => {
          const dayOrders = orders.filter(
            (o) => toKarachiDateKey(o.created_at) === key,
          );
          const dayPurchases = purchases.filter(
            (p) => toKarachiDateKey(p.purchased_at) === key,
          );
          const summary = summarizeOrders(dayOrders);
          const purchaseSpend = dayPurchases.reduce(
            (sum, p) => sum + Number(p.subtotal),
            0,
          );
          return {
            key,
            day: Number(key.slice(-2)),
            label: formatKarachiDayLabel(key),
            ...summary,
            purchaseSpend,
            netCash: summary.revenue - purchaseSpend,
          };
        })
      : [];

  const dayKey =
    month && day
      ? `${year}-${String(month).padStart(2, "0")}-${padDay(day)}`
      : null;

  let dayOrders: OrderWithItems[] = [];
  if (dayKey) {
    dayOrders = orders.filter((o) => toKarachiDateKey(o.created_at) === dayKey);
    if (q) {
      const lower = q.toLowerCase();
      dayOrders = dayOrders.filter(
        (o) =>
          o.order_number.toLowerCase().includes(lower) ||
          o.customer_name.toLowerCase().includes(lower) ||
          o.customer_phone.includes(q),
      );
    }
  }

  const dayMeta = dayKey
    ? dayRows.find((row) => row.key === dayKey) ?? null
    : null;

  const scopeStats =
    level === "day" && dayMeta
      ? dayMeta
      : level === "month" && monthMeta
        ? monthMeta
        : yearTotals;

  const scopeLabel =
    level === "day" && dayKey
      ? formatKarachiDayLabel(dayKey)
      : level === "month" && month
        ? `${monthLabelLong(month)} ${year}`
        : String(year);

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const y = defaultYear - i;
    return { value: String(y), label: String(y) };
  });

  const qsBase = `payment=${encodeURIComponent(payment)}`;
  const yearHref = `/admin/reports?year=${year}&${qsBase}`;
  const monthHref =
    month != null
      ? `/admin/reports?year=${year}&month=${month}&${qsBase}`
      : yearHref;

  const crumbs = [
    { label: "Reports", href: yearHref },
    { label: String(year), href: level === "year" ? undefined : yearHref },
    ...(month
      ? [
          {
            label: monthLabelLong(month),
            href: level === "month" ? undefined : monthHref,
          },
        ]
      : []),
    ...(dayKey
      ? [{ label: formatKarachiDayLabel(dayKey) }]
      : []),
  ];

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-body text-xl font-normal text-white sm:text-2xl lg:text-3xl">
            Profit reports
          </h1>
          <p className="mt-1 text-xs text-white/50 sm:mt-2 sm:text-sm">
            Click a month for daily totals, then a day for that day’s orders.
            Times in Asia/Karachi.
          </p>
        </div>
        <div className="flex w-full justify-end sm:w-auto">
          <Suspense fallback={null}>
            <AdminFilterBar
              title="Report filters"
              preserveParams={
                level === "day"
                  ? ["month", "day"]
                  : level === "month"
                    ? ["month"]
                    : []
              }
              fields={
                [
                  ...(level === "day"
                    ? [
                        {
                          name: "q",
                          label: "Search orders",
                          placeholder: "Order # / customer",
                        },
                      ]
                    : []),
                  {
                    name: "year",
                    label: "Year",
                    type: "select",
                    options: yearOptions,
                    defaultValue: String(year),
                    allowEmpty: false,
                  },
                  {
                    name: "payment",
                    label: "Sales filter",
                    type: "select",
                    options: [
                      { value: "paid", label: "Paid only" },
                      { value: "all", label: "Include unpaid" },
                    ],
                    defaultValue: "paid",
                    allowEmpty: false,
                  },
                ] satisfies FilterField[]
              }
            />
          </Suspense>
        </div>
      </div>

      <PeriodBreadcrumb items={crumbs} />

      <StatGrid>
        <StatCard
          label={`${scopeLabel} revenue`}
          value={formatPrice(scopeStats.revenue)}
          icon={DollarSign}
        />
        <StatCard
          label={`${scopeLabel} gross profit`}
          value={formatPrice(scopeStats.grossProfit)}
          icon={TrendingUp}
        />
        <StatCard
          label={`${scopeLabel} purchases`}
          value={formatPrice(scopeStats.purchaseSpend)}
          icon={ShoppingBag}
        />
        <StatCard
          label={`${scopeLabel} net cash`}
          value={formatPrice(scopeStats.netCash)}
          icon={Wallet}
        />
      </StatGrid>

      {"missing" in scopeStats && scopeStats.missing > 0 && (
        <div className="mb-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {scopeStats.missing} order line(s) in this period are missing unit
          cost — profit may be overstated.
        </div>
      )}

      {level === "year" && (
        <Table minWidth="min-w-[720px]">
          <THead>
            <Tr>
              <Th>Month</Th>
              <Th align="right">Revenue</Th>
              <Th align="right">COGS</Th>
              <Th align="right">Gross profit</Th>
              <Th align="right">Purchases</Th>
              <Th align="right">Net cash</Th>
              <Th align="right">Orders</Th>
            </Tr>
          </THead>
          <TBody>
            {months.map((m) => (
              <Tr key={m.month}>
                <Td>
                  <Link
                    href={`/admin/reports?year=${year}&month=${m.month}&${qsBase}`}
                    className="font-medium text-gold hover:text-gold-light"
                  >
                    {m.label}
                  </Link>
                </Td>
                <Td align="right" className={numeric}>
                  {formatPrice(m.revenue)}
                </Td>
                <Td align="right" className={numeric}>
                  {formatPrice(m.cogs)}
                </Td>
                <Td align="right" className={`text-gold ${numeric}`}>
                  {formatPrice(m.grossProfit)}
                </Td>
                <Td align="right" className={numeric}>
                  {formatPrice(m.purchaseSpend)}
                </Td>
                <Td align="right" className={numeric}>
                  {formatPrice(m.netCash)}
                </Td>
                <Td align="right" className={numeric}>
                  {m.orderCount}
                </Td>
              </Tr>
            ))}
            <Tr className="bg-white/5 font-medium">
              <Td className="text-white">{year} total</Td>
              <Td align="right" className={numeric}>
                {formatPrice(yearTotals.revenue)}
              </Td>
              <Td align="right" className={numeric}>
                {formatPrice(yearTotals.cogs)}
              </Td>
              <Td align="right" className={`text-gold ${numeric}`}>
                {formatPrice(yearTotals.grossProfit)}
              </Td>
              <Td align="right" className={numeric}>
                {formatPrice(yearTotals.purchaseSpend)}
              </Td>
              <Td align="right" className={numeric}>
                {formatPrice(yearTotals.netCash)}
              </Td>
              <Td align="right" className={numeric}>
                {yearTotals.orderCount}
              </Td>
            </Tr>
          </TBody>
        </Table>
      )}

      {level === "month" && month != null && (
        <Table minWidth="min-w-[720px]">
          <THead>
            <Tr>
              <Th>Day</Th>
              <Th align="right">Revenue</Th>
              <Th align="right">COGS</Th>
              <Th align="right">Gross profit</Th>
              <Th align="right">Purchases</Th>
              <Th align="right">Net cash</Th>
              <Th align="right">Orders</Th>
            </Tr>
          </THead>
          <TBody>
            {dayRows.map((row) => (
              <Tr key={row.key}>
                <Td>
                  <Link
                    href={`/admin/reports?year=${year}&month=${month}&day=${row.day}&${qsBase}`}
                    className="font-medium text-gold hover:text-gold-light"
                  >
                    {row.label}
                  </Link>
                </Td>
                <Td align="right" className={numeric}>
                  {formatPrice(row.revenue)}
                </Td>
                <Td align="right" className={numeric}>
                  {formatPrice(row.cogs)}
                </Td>
                <Td align="right" className={`text-gold ${numeric}`}>
                  {formatPrice(row.grossProfit)}
                </Td>
                <Td align="right" className={numeric}>
                  {formatPrice(row.purchaseSpend)}
                </Td>
                <Td align="right" className={numeric}>
                  {formatPrice(row.netCash)}
                </Td>
                <Td align="right" className={numeric}>
                  {row.orderCount}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      )}

      {level === "day" && dayKey && (
        <div>
          <h2 className="mb-4 font-body text-xl text-white">
            Orders on {formatKarachiDayLabel(dayKey)}
          </h2>
          {dayOrders.length === 0 ? (
            <div className="rounded-lg border border-glass-border bg-glass-bg px-4 py-8 text-center text-sm text-white/60 sm:p-10">
              No orders on this day.
            </div>
          ) : (
            <Table minWidth="min-w-[560px]">
              <THead>
                <Tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th align="right">Total</Th>
                  <Th align="right">Profit</Th>
                </Tr>
              </THead>
              <TBody>
                {dayOrders.map((order) => {
                  const profit = computeOrderProfit(order.items);
                  return (
                    <Tr key={order.id}>
                      <Td>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className={`text-gold hover:text-gold-light ${numeric}`}
                        >
                          {order.order_number}
                        </Link>
                      </Td>
                      <Td className="text-white/70">{order.customer_name}</Td>
                      <Td align="right" className={numeric}>
                        {formatPrice(Number(order.total))}
                      </Td>
                      <Td align="right" className={`text-gold ${numeric}`}>
                        {formatPrice(profit.profit)}
                      </Td>
                    </Tr>
                  );
                })}
              </TBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}
