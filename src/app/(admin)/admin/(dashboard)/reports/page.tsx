import Link from "next/link";
import { Suspense } from "react";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/utils";
import { numeric } from "@/lib/classes";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import type { FilterField } from "@/components/admin/AdminFilterBar";
import PeriodBreadcrumb from "@/components/admin/PeriodBreadcrumb";
import ReportManualEntryControl from "@/components/admin/ReportManualEntryControl";
import { computeOrderProfit } from "@/lib/admin/profit";
import {
  currentKarachiYearMonth,
  formatKarachiDayLabel,
  karachiDayEndExclusiveIso,
  karachiDayKeysInMonth,
  karachiDayStartIso,
  karachiMonthBounds,
  karachiYearBounds,
  monthLabel,
  monthLabelLong,
  padDay,
} from "@/lib/admin/dates";
import { fetchReportTimeBuckets } from "@/lib/admin/queries";
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
import type { OrderWithItems, ReportManualEntry } from "@/types/db";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function param(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : "";
}

function manualSlice(entry?: ReportManualEntry | null) {
  if (!entry) {
    return { revenue: 0, purchases: 0, profit: 0, orderCount: 0 };
  }
  return {
    revenue: Number(entry.revenue),
    purchases: Number(entry.purchase_spend),
    profit: Number(entry.gross_profit),
    orderCount: Number(entry.order_count) || 0,
  };
}

type MonthRow = {
  month: number;
  label: string;
  shortLabel: string;
  revenue: number;
  grossProfit: number;
  missing: number;
  orderCount: number;
  purchaseSpend: number;
};

type DayRow = {
  key: string;
  day: number;
  label: string;
  revenue: number;
  grossProfit: number;
  missing: number;
  orderCount: number;
  purchaseSpend: number;
  entry: ReportManualEntry | null;
};

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
  const payment = param(sp.payment) || "all";
  const q = param(sp.q).trim();
  const paidOnly = payment === "paid";
  const level = day ? "day" : month ? "month" : "year";

  const supabase = await createClient();
  const yearBounds = karachiYearBounds(year);
  const dayKey =
    month && day
      ? `${year}-${String(month).padStart(2, "0")}-${padDay(day)}`
      : null;
  const monthBounds = month != null ? karachiMonthBounds(year, month) : null;

  const [manualResult, monthlyBuckets, dailyBuckets, dayOrdersResult] =
    await Promise.all([
      supabase
        .from("report_manual_entries")
        .select(
          "id, year, month, day, revenue, purchase_spend, gross_profit, order_count, notes, created_at, updated_at",
        )
        .eq("year", year),
      level === "year" || level === "month"
        ? fetchReportTimeBuckets(
            supabase,
            yearBounds.from,
            yearBounds.to,
            paidOnly,
            "month",
          )
        : Promise.resolve(null),
      level === "month" && monthBounds
        ? fetchReportTimeBuckets(
            supabase,
            monthBounds.from,
            monthBounds.to,
            paidOnly,
            "day",
          )
        : Promise.resolve(null),
      dayKey
        ? (() => {
            let query = supabase
              .from("orders")
              .select(
                "id, order_number, customer_name, customer_phone, total, payment_status, status, created_at, items:order_items(unit_price, unit_cost, quantity)",
              )
              .gte("created_at", karachiDayStartIso(dayKey))
              .lt("created_at", karachiDayEndExclusiveIso(dayKey))
              .neq("status", "cancelled")
              .order("created_at", { ascending: false });
            if (paidOnly) query = query.eq("payment_status", "paid");
            else query = query.neq("payment_status", "refunded");
            if (q) {
              query = query.or(
                `order_number.ilike.%${q}%,customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%`,
              );
            }
            return query;
          })()
        : Promise.resolve({ data: null as unknown }),
    ]);

  const manuals = (manualResult.data ?? []) as ReportManualEntry[];
  const dayLevelByKey = new Map<string, ReportManualEntry>();
  for (const row of manuals) {
    dayLevelByKey.set(
      `${row.year}-${String(row.month).padStart(2, "0")}-${padDay(row.day)}`,
      row,
    );
  }

  const monthBucketMap = new Map(
    (monthlyBuckets ?? []).map((b) => [Number(b.bucketKey), b]),
  );

  const months: MonthRow[] = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const bucket = monthBucketMap.get(m);
    const revenue = bucket?.revenue ?? 0;
    const cogs = bucket?.cogs ?? 0;
    let dayManualRevenue = 0;
    let dayManualPurchases = 0;
    let dayManualProfit = 0;
    let dayManualOrders = 0;
    const prefix = `${year}-${String(m).padStart(2, "0")}-`;
    for (const [key, entry] of dayLevelByKey) {
      if (!key.startsWith(prefix)) continue;
      const slice = manualSlice(entry);
      dayManualRevenue += slice.revenue;
      dayManualPurchases += slice.purchases;
      dayManualProfit += slice.profit;
      dayManualOrders += slice.orderCount;
    }
    return {
      month: m,
      label: monthLabelLong(m),
      shortLabel: monthLabel(m),
      revenue: revenue + dayManualRevenue,
      grossProfit: revenue - cogs + dayManualProfit,
      missing: bucket?.missingCostLines ?? 0,
      orderCount: (bucket?.orderCount ?? 0) + dayManualOrders,
      purchaseSpend: cogs + dayManualPurchases,
    };
  });

  if (!monthlyBuckets && (level === "year" || level === "month")) {
    let fallbackQuery = supabase
      .from("orders")
      .select(
        "total, created_at, items:order_items(unit_price, unit_cost, quantity)",
      )
      .gte("created_at", yearBounds.from)
      .lt("created_at", yearBounds.to)
      .neq("status", "cancelled");
    if (paidOnly) fallbackQuery = fallbackQuery.eq("payment_status", "paid");
    else fallbackQuery = fallbackQuery.neq("payment_status", "refunded");
    const { data: fallbackOrders } = await fallbackQuery;
    const byMonth = new Map<
      number,
      { revenue: number; cogs: number; missing: number; orderCount: number }
    >();
    for (const order of fallbackOrders ?? []) {
      const key = Number(
        new Date(order.created_at).toLocaleString("en-CA", {
          timeZone: "Asia/Karachi",
          month: "2-digit",
        }),
      );
      const prev = byMonth.get(key) ?? {
        revenue: 0,
        cogs: 0,
        missing: 0,
        orderCount: 0,
      };
      prev.revenue += Number(order.total) || 0;
      prev.orderCount += 1;
      const profit = computeOrderProfit(order.items ?? []);
      prev.cogs += profit.cogs;
      prev.missing += profit.missingCostLines;
      byMonth.set(key, prev);
    }
    for (const row of months) {
      const summary = byMonth.get(row.month);
      if (!summary) continue;
      let dayManualRevenue = 0;
      let dayManualPurchases = 0;
      let dayManualProfit = 0;
      let dayManualOrders = 0;
      const prefix = `${year}-${String(row.month).padStart(2, "0")}-`;
      for (const [key, entry] of dayLevelByKey) {
        if (!key.startsWith(prefix)) continue;
        const slice = manualSlice(entry);
        dayManualRevenue += slice.revenue;
        dayManualPurchases += slice.purchases;
        dayManualProfit += slice.profit;
        dayManualOrders += slice.orderCount;
      }
      row.revenue = summary.revenue + dayManualRevenue;
      row.grossProfit = summary.revenue - summary.cogs + dayManualProfit;
      row.missing = summary.missing;
      row.orderCount = summary.orderCount + dayManualOrders;
      row.purchaseSpend = summary.cogs + dayManualPurchases;
    }
  }

  const yearTotals = months.reduce(
    (acc, m) => ({
      revenue: acc.revenue + m.revenue,
      grossProfit: acc.grossProfit + m.grossProfit,
      purchaseSpend: acc.purchaseSpend + m.purchaseSpend,
      missing: acc.missing + m.missing,
      orderCount: acc.orderCount + m.orderCount,
    }),
    {
      revenue: 0,
      grossProfit: 0,
      purchaseSpend: 0,
      missing: 0,
      orderCount: 0,
    },
  );

  const monthMeta = month ? months.find((row) => row.month === month) : null;
  const dayBucketMap = new Map(
    (dailyBuckets ?? []).map((b) => [b.bucketKey, b]),
  );

  const dayRows: DayRow[] =
    month != null
      ? karachiDayKeysInMonth(year, month).map((key) => {
          const bucket = dayBucketMap.get(key);
          const revenue = bucket?.revenue ?? 0;
          const cogs = bucket?.cogs ?? 0;
          const entry = dayLevelByKey.get(key) ?? null;
          const manual = manualSlice(entry);
          return {
            key,
            day: Number(key.slice(-2)),
            label: formatKarachiDayLabel(key),
            revenue: revenue + manual.revenue,
            grossProfit: revenue - cogs + manual.profit,
            missing: bucket?.missingCostLines ?? 0,
            orderCount: (bucket?.orderCount ?? 0) + manual.orderCount,
            purchaseSpend: cogs + manual.purchases,
            entry,
          };
        })
      : [];

  if (!dailyBuckets && month != null && monthBounds) {
    let fallbackQuery = supabase
      .from("orders")
      .select(
        "total, created_at, items:order_items(unit_price, unit_cost, quantity)",
      )
      .gte("created_at", monthBounds.from)
      .lt("created_at", monthBounds.to)
      .neq("status", "cancelled");
    if (paidOnly) fallbackQuery = fallbackQuery.eq("payment_status", "paid");
    else fallbackQuery = fallbackQuery.neq("payment_status", "refunded");
    const { data: fallbackOrders } = await fallbackQuery;
    const byDay = new Map<
      string,
      { revenue: number; cogs: number; missing: number; orderCount: number }
    >();
    for (const order of fallbackOrders ?? []) {
      const key = new Date(order.created_at).toLocaleDateString("en-CA", {
        timeZone: "Asia/Karachi",
      });
      const prev = byDay.get(key) ?? {
        revenue: 0,
        cogs: 0,
        missing: 0,
        orderCount: 0,
      };
      prev.revenue += Number(order.total) || 0;
      prev.orderCount += 1;
      const profit = computeOrderProfit(order.items ?? []);
      prev.cogs += profit.cogs;
      prev.missing += profit.missingCostLines;
      byDay.set(key, prev);
    }
    for (const row of dayRows) {
      const summary = byDay.get(row.key);
      if (!summary) continue;
      const manual = manualSlice(row.entry);
      row.revenue = summary.revenue + manual.revenue;
      row.grossProfit = summary.revenue - summary.cogs + manual.profit;
      row.missing = summary.missing;
      row.orderCount = summary.orderCount + manual.orderCount;
      row.purchaseSpend = summary.cogs + manual.purchases;
    }
  }

  const dayOrders = ((dayOrdersResult as { data?: unknown }).data ??
    []) as unknown as OrderWithItems[];
  const dayMeta = dayKey
    ? (dayRows.find((row) => row.key === dayKey) ?? null)
    : null;

  const scopeStats =
    level === "day" && dayMeta
      ? dayMeta
      : level === "month" && monthMeta
        ? monthMeta
        : yearTotals;

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
    ...(dayKey ? [{ label: formatKarachiDayLabel(dayKey) }] : []),
  ];

  return (
    <div>
      <StatGrid columns={3}>
        <StatCard
          label="Purchases"
          value={formatPrice(scopeStats.purchaseSpend)}
          icon={ShoppingBag}
        />
        <StatCard
          label="Sales"
          value={formatPrice(scopeStats.revenue)}
          icon={DollarSign}
        />
        <StatCard
          label="Gross profit"
          value={formatPrice(scopeStats.grossProfit)}
          icon={TrendingUp}
        />
      </StatGrid>

      <Suspense fallback={null}>
        <AdminFilterBar
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
                      placeholder: "Search order # / customer",
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
                  { value: "all", label: "All" },
                  { value: "paid", label: "Paid only" },
                ],
                defaultValue: "all",
                allowEmpty: false,
              },
            ] satisfies FilterField[]
          }
          actions={
            level === "day" && month != null && day != null ? (
              <ReportManualEntryControl
                year={year}
                month={month}
                day={day}
                entry={dayMeta?.entry}
              />
            ) : undefined
          }
        />
      </Suspense>

      <PeriodBreadcrumb items={crumbs} />

      {"missing" in scopeStats && scopeStats.missing > 0 && (
        <div className="mb-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {scopeStats.missing} order line(s) in this period are missing unit
          cost — profit may be overstated.
        </div>
      )}

      {level === "year" && (
        <Table minWidth="min-w-[560px]">
          <THead>
            <Tr>
              <Th>Month</Th>
              <Th align="right">Purchases</Th>
              <Th align="right">Sales</Th>
              <Th align="right">Gross profit</Th>
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
                  {formatPrice(m.purchaseSpend)}
                </Td>
                <Td align="right" className={numeric}>
                  {formatPrice(m.revenue)}
                </Td>
                <Td align="right" className={`text-gold ${numeric}`}>
                  {formatPrice(m.grossProfit)}
                </Td>
                <Td align="right" className={numeric}>
                  {m.orderCount}
                </Td>
              </Tr>
            ))}
            <Tr className="bg-white/5 font-medium">
              <Td className="text-white">{year} total</Td>
              <Td align="right" className={numeric}>
                {formatPrice(yearTotals.purchaseSpend)}
              </Td>
              <Td align="right" className={numeric}>
                {formatPrice(yearTotals.revenue)}
              </Td>
              <Td align="right" className={`text-gold ${numeric}`}>
                {formatPrice(yearTotals.grossProfit)}
              </Td>
              <Td align="right" className={numeric}>
                {yearTotals.orderCount}
              </Td>
            </Tr>
          </TBody>
        </Table>
      )}

      {level === "month" && month != null && (
        <Table minWidth="min-w-[620px]">
          <THead>
            <Tr>
              <Th>Day</Th>
              <Th align="right">Purchases</Th>
              <Th align="right">Sales</Th>
              <Th align="right">Gross profit</Th>
              <Th align="right">Orders</Th>
              <Th align="right" />
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
                  {formatPrice(row.purchaseSpend)}
                </Td>
                <Td align="right" className={numeric}>
                  {formatPrice(row.revenue)}
                </Td>
                <Td align="right" className={`text-gold ${numeric}`}>
                  {formatPrice(row.grossProfit)}
                </Td>
                <Td align="right" className={numeric}>
                  {row.orderCount}
                </Td>
                <Td align="right">
                  <ReportManualEntryControl
                    year={year}
                    month={month}
                    day={row.day}
                    entry={row.entry}
                    compact
                  />
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      )}

      {level === "day" && dayKey && month != null && day != null && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 font-body text-xl text-white">
              Orders on {formatKarachiDayLabel(dayKey)}
            </h2>
            {dayOrders.length === 0 ? (
              <div className="rounded-lg border border-glass-border bg-glass-bg px-4 py-8 text-center text-sm text-white/60 sm:p-10">
                No website orders on this day. Use{" "}
                <span className="text-white/80">Add totals</span> if you want
                to record this day manually.
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
        </div>
      )}
    </div>
  );
}
