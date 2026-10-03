import type { OrderItem, OrderProfit } from "@/types/db";

export function computeOrderProfit(
  items: Pick<OrderItem, "unit_price" | "unit_cost" | "quantity">[],
): OrderProfit {
  let goodsRevenue = 0;
  let cogs = 0;
  let missingCostLines = 0;

  for (const item of items) {
    const qty = item.quantity;
    goodsRevenue += Number(item.unit_price) * qty;
    if (item.unit_cost == null) {
      missingCostLines += 1;
    } else {
      cogs += Number(item.unit_cost) * qty;
    }
  }

  return {
    goodsRevenue,
    cogs,
    profit: goodsRevenue - cogs,
    missingCostLines,
  };
}
