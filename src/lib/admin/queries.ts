import type { SupabaseClient } from "@supabase/supabase-js";

export interface ProductCatalogStats {
  total: number;
  active: number;
  low: number;
  out: number;
}

export interface OrderListStats {
  total: number;
  pending: number;
  unpaid: number;
  paid: number;
}

export interface PeriodSalesStats {
  orderCount: number;
  paidRevenue: number;
  paidGoodsRevenue: number;
  paidCogs: number;
  paidProfit: number;
}

export interface ReportBucket {
  bucketKey: string;
  revenue: number;
  cogs: number;
  orderCount: number;
  missingCostLines: number;
}

function asNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Single-scan product catalog stats (RPC). Falls back to head counts. */
export async function fetchProductCatalogStats(
  supabase: SupabaseClient,
): Promise<ProductCatalogStats> {
  const { data, error } = await supabase.rpc("admin_product_catalog_stats");
  if (!error && data && typeof data === "object") {
    const row = data as Record<string, unknown>;
    return {
      total: asNumber(row.total),
      active: asNumber(row.active),
      low: asNumber(row.low),
      out: asNumber(row.out),
    };
  }

  const [
    { count: total },
    { count: active },
    { count: low },
    { count: out },
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .gt("stock", 0)
      .lte("stock", 5),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("stock", 0),
  ]);

  return {
    total: total ?? 0,
    active: active ?? 0,
    low: low ?? 0,
    out: out ?? 0,
  };
}

/** Single-scan order list stats (RPC). Falls back to head counts. */
export async function fetchOrderListStats(
  supabase: SupabaseClient,
): Promise<OrderListStats> {
  const { data, error } = await supabase.rpc("admin_order_list_stats");
  if (!error && data && typeof data === "object") {
    const row = data as Record<string, unknown>;
    return {
      total: asNumber(row.total),
      pending: asNumber(row.pending),
      unpaid: asNumber(row.unpaid),
      paid: asNumber(row.paid),
    };
  }

  const [
    { count: total },
    { count: pending },
    { count: unpaid },
    { count: paid },
  ] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("payment_status", "unpaid")
      .neq("status", "cancelled"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("payment_status", "paid"),
  ]);

  return {
    total: total ?? 0,
    pending: pending ?? 0,
    unpaid: unpaid ?? 0,
    paid: paid ?? 0,
  };
}

/** Dashboard MTD aggregates without hydrating order rows. */
export async function fetchPeriodSalesStats(
  supabase: SupabaseClient,
  fromIso: string,
  toIso: string,
): Promise<PeriodSalesStats> {
  const { data, error } = await supabase.rpc("admin_period_sales_stats", {
    p_from: fromIso,
    p_to: toIso,
  });

  if (!error && data && typeof data === "object") {
    const row = data as Record<string, unknown>;
    return {
      orderCount: asNumber(row.order_count),
      paidRevenue: asNumber(row.paid_revenue),
      paidGoodsRevenue: asNumber(row.paid_goods_revenue),
      paidCogs: asNumber(row.paid_cogs),
      paidProfit: asNumber(row.paid_profit),
    };
  }

  // Fallback: bounded month query (still better than unbounded year).
  const { data: orders } = await supabase
    .from("orders")
    .select(
      "total, payment_status, items:order_items(unit_price, unit_cost, quantity)",
    )
    .gte("created_at", fromIso)
    .lt("created_at", toIso)
    .neq("status", "cancelled");

  let paidRevenue = 0;
  let paidGoods = 0;
  let paidCogs = 0;
  for (const order of orders ?? []) {
    if (order.payment_status !== "paid") continue;
    paidRevenue += Number(order.total) || 0;
    for (const item of order.items ?? []) {
      const qty = Number(item.quantity) || 0;
      paidGoods += Number(item.unit_price) * qty;
      if (item.unit_cost != null) {
        paidCogs += Number(item.unit_cost) * qty;
      }
    }
  }

  return {
    orderCount: (orders ?? []).length,
    paidRevenue,
    paidGoodsRevenue: paidGoods,
    paidCogs,
    paidProfit: paidGoods - paidCogs,
  };
}

/** Report month/day buckets via RPC (avoids loading all year orders into Node). */
export async function fetchReportTimeBuckets(
  supabase: SupabaseClient,
  fromIso: string,
  toIso: string,
  paidOnly: boolean,
  grain: "month" | "day",
): Promise<ReportBucket[] | null> {
  const { data, error } = await supabase.rpc("admin_report_time_buckets", {
    p_from: fromIso,
    p_to: toIso,
    p_paid_only: paidOnly,
    p_grain: grain,
  });

  if (error || !Array.isArray(data)) return null;

  return data.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      bucketKey: String(r.bucket_key ?? ""),
      revenue: asNumber(r.revenue),
      cogs: asNumber(r.cogs),
      orderCount: asNumber(r.order_count),
      missingCostLines: asNumber(r.missing_cost_lines),
    };
  });
}
