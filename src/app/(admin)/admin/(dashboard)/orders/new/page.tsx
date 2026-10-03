import { createClient } from "@/lib/supabase/server";
import OrderForm from "@/components/admin/OrderForm";
import type { Product } from "@/types/db";

export default async function AdminNewOrderPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, price, cost_price, stock")
    .eq("is_active", true)
    .order("name");

  return (
    <OrderForm
      products={(data ?? []) as Pick<
        Product,
        "id" | "name" | "price" | "cost_price" | "stock"
      >[]}
    />
  );
}
