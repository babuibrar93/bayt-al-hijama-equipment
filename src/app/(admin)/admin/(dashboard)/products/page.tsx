import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/utils";
import { cn, numeric } from "@/lib/classes";
import ProductImage from "@/components/shop/ProductImage";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import {
  Button,
  Badge,
  Table,
  THead,
  TBody,
  Tr,
  Th,
  Td,
} from "@/components/ui";
import type { ProductWithCategory } from "@/types/db";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .order("created_at", { ascending: false });

  const products = (data ?? []) as unknown as ProductWithCategory[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-body text-2xl font-normal text-white sm:text-3xl">
          Products
        </h1>
        <Button href="/admin/products/new" leftIcon={<Plus className="h-4 w-4" />}>
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-glass-border bg-glass-bg p-10 text-center text-white/60">
          No products yet. Add your first product to get started.
        </div>
      ) : (
        <Table>
          <THead>
            <Tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th align="right">Price</Th>
              <Th align="right">Stock</Th>
              <Th>Status</Th>
              <Th align="right">Actions</Th>
            </Tr>
          </THead>
          <TBody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md">
                      <ProductImage
                        src={product.images[0] ?? null}
                        alt={product.name}
                        sizes="44px"
                      />
                    </div>
                    <span className="font-medium text-white">{product.name}</span>
                  </div>
                </Td>
                <Td className="text-white/60">{product.category?.name ?? "—"}</Td>
                <Td align="right" className={numeric}>
                  {formatPrice(product.price)}
                </Td>
                <Td
                  align="right"
                  className={cn(
                    numeric,
                    product.stock <= 5 ? "text-amber-300" : "text-white/80",
                  )}
                >
                  {product.stock}
                </Td>
                <Td>
                  <Badge tone={product.is_active ? "green" : "neutral"}>
                    {product.is_active ? "Active" : "Hidden"}
                  </Badge>
                </Td>
                <Td align="right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      aria-label={`Edit ${product.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-glass-border text-white/60 transition-colors hover:border-gold/40 hover:text-gold"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
