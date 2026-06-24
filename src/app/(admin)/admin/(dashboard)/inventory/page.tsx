import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductImage from "@/components/shop/ProductImage";
import StockEditor from "@/components/admin/StockEditor";
import { Badge, Table, THead, TBody, Tr, Th, Td } from "@/components/ui";
import type { BadgeTone } from "@/components/ui";
import type { Product } from "@/types/db";

const LOW_STOCK_THRESHOLD = 5;

function stockBadge(stock: number): { tone: BadgeTone; label: string } {
  if (stock === 0) return { tone: "red", label: "Out of stock" };
  if (stock <= LOW_STOCK_THRESHOLD) return { tone: "amber", label: "Low" };
  return { tone: "green", label: "In stock" };
}

export default async function AdminInventoryPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, images, stock, is_active")
    .order("stock", { ascending: true });

  const products = (data ?? []) as Pick<
    Product,
    "id" | "name" | "images" | "stock" | "is_active"
  >[];

  const lowStock = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD);

  return (
    <div>
      <h1 className="mb-1.5 font-display text-2xl font-normal text-white sm:text-3xl">
        Inventory
      </h1>
      <p className="mb-6 text-sm text-white/50">
        Update stock levels inline. Items at or below {LOW_STOCK_THRESHOLD} units
        are flagged.
      </p>

      {lowStock.length > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
          {lowStock.length} item{lowStock.length > 1 ? "s" : ""} running low on
          stock.
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-lg border border-glass-border bg-glass-bg p-10 text-center text-white/60">
          No products yet.
        </div>
      ) : (
        <Table minWidth="min-w-[520px]">
          <THead>
            <Tr>
              <Th>Product</Th>
              <Th>Status</Th>
              <Th align="right">Stock</Th>
            </Tr>
          </THead>
          <TBody>
            {products.map((product) => {
              const badge = stockBadge(product.stock);
              return (
                <Tr key={product.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md">
                        <ProductImage
                          src={product.images[0] ?? null}
                          alt={product.name}
                          sizes="40px"
                        />
                      </div>
                      <span className="font-medium text-white">
                        {product.name}
                      </span>
                    </div>
                  </Td>
                  <Td>
                    <Badge tone={badge.tone}>{badge.label}</Badge>
                  </Td>
                  <Td align="right">
                    <div className="flex justify-end">
                      <StockEditor id={product.id} initialStock={product.stock} />
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </TBody>
        </Table>
      )}
    </div>
  );
}
