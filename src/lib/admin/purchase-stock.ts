import type { SupabaseClient } from "@supabase/supabase-js";

type StockLine = {
  product_id: string | null;
  product_name: string;
  quantity: number;
};

/** Increase stock for confirmed purchase lines. */
export async function applyStockIncrement(
  db: SupabaseClient,
  lines: StockLine[],
): Promise<{ error?: string }> {
  for (const line of lines) {
    if (!line.product_id) continue;
    const { data: product, error } = await db
      .from("products")
      .select("id, stock, name")
      .eq("id", line.product_id)
      .maybeSingle();
    if (error || !product) {
      return { error: `Product not found for ${line.product_name}` };
    }
    const { error: updErr } = await db
      .from("products")
      .update({ stock: Number(product.stock) + line.quantity })
      .eq("id", product.id);
    if (updErr) return { error: updErr.message };
  }
  return {};
}

/** Decrease stock when cancelling a confirmed purchase. Blocks if insufficient. */
export async function applyStockDecrement(
  db: SupabaseClient,
  lines: StockLine[],
): Promise<{ error?: string }> {
  for (const line of lines) {
    if (!line.product_id) continue;
    const { data: product, error } = await db
      .from("products")
      .select("id, stock, name")
      .eq("id", line.product_id)
      .maybeSingle();
    if (error || !product) {
      return { error: `Product not found for ${line.product_name}` };
    }
    const next = Number(product.stock) - line.quantity;
    if (next < 0) {
      return {
        error: `Cannot reverse purchase: insufficient stock for ${product.name} (have ${product.stock}, need ${line.quantity})`,
      };
    }
    const { error: updErr } = await db
      .from("products")
      .update({ stock: next })
      .eq("id", product.id);
    if (updErr) return { error: updErr.message };
  }
  return {};
}

/** Apply qty deltas when editing a confirmed purchase (new - old per product). */
export async function applyStockDeltas(
  db: SupabaseClient,
  deltas: { productId: string; productName: string; delta: number }[],
): Promise<{ error?: string }> {
  for (const { productId, productName, delta } of deltas) {
    if (delta === 0) continue;
    const { data: product, error } = await db
      .from("products")
      .select("id, stock, name")
      .eq("id", productId)
      .maybeSingle();
    if (error || !product) {
      return { error: `Product not found for ${productName}` };
    }
    const next = Number(product.stock) + delta;
    if (next < 0) {
      return {
        error: `Insufficient stock for ${product.name} after edit (would be ${next})`,
      };
    }
    const { error: updErr } = await db
      .from("products")
      .update({ stock: next })
      .eq("id", product.id);
    if (updErr) return { error: updErr.message };
  }
  return {};
}
