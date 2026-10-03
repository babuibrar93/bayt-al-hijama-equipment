import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PurchaseForm from "@/components/admin/PurchaseForm";
import PurchaseActions from "@/components/admin/PurchaseActions";
import type { Product, PurchaseWithItems } from "@/types/db";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPurchaseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: purchase }, { data: products }] = await Promise.all([
    supabase
      .from("purchases")
      .select("*, items:purchase_items(*)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("products").select("id, name, cost_price, stock").order("name"),
  ]);

  if (!purchase) notFound();

  const row = purchase as unknown as PurchaseWithItems;

  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
      <PurchaseActions
        purchaseId={row.id}
        status={row.status}
        purchaseNumber={row.purchase_number}
      />
      <PurchaseForm
        mode="edit"
        purchaseId={row.id}
        products={
          (products ?? []) as Pick<
            Product,
            "id" | "name" | "cost_price" | "stock"
          >[]
        }
        initial={{
          supplierName: row.supplier_name,
          supplierPhone: row.supplier_phone ?? "",
          notes: row.notes ?? "",
          status: row.status,
          items: row.items.map((item) => ({
            productId: item.product_id,
            productName: item.product_name,
            unitCost: Number(item.unit_cost),
            quantity: item.quantity,
          })),
        }}
      />
    </div>
  );
}
