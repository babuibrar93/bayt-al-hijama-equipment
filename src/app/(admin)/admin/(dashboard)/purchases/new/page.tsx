import { createClient } from "@/lib/supabase/server";
import PurchaseForm from "@/components/admin/PurchaseForm";
import type { Product } from "@/types/db";

export default async function AdminNewPurchasePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, cost_price, stock")
    .order("name");

  return (
    <PurchaseForm
      products={
        (data ?? []) as Pick<Product, "id" | "name" | "cost_price" | "stock">[]
      }
    />
  );
}
