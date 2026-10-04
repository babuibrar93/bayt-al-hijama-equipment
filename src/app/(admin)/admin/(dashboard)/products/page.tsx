import Link from "next/link";
import { Suspense } from "react";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/utils";
import { cn, numeric } from "@/lib/classes";
import ProductImage from "@/components/shop/ProductImage";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
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
import { ADMIN_PAGE_SIZE, parsePage, parsePerPage } from "@/lib/admin/list-href";
import type { Category, ProductWithCategory } from "@/types/db";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function param(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : "";
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = param(sp.q).trim();
  const category = param(sp.category);
  const active = param(sp.active);
  const stock = param(sp.stock);
  const page = parsePage(param(sp.page));
  const perPage = parsePerPage(param(sp.perPage), ADMIN_PAGE_SIZE);
  const filters = { q, category, active, stock };

  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order");

  let query = supabase
    .from("products")
    .select(
      "id, name, slug, price, cost_price, stock, images, is_active, created_at, category:categories(id, name, slug)",
      { count: "exact" },
    )
    .order("updated_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (q) {
    query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%`);
  }
  if (category) {
    const cat = (categories as Category[] | null)?.find(
      (c) => c.slug === category,
    );
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (active === "active") query = query.eq("is_active", true);
  if (active === "inactive") query = query.eq("is_active", false);
  if (stock === "out") query = query.eq("stock", 0);
  if (stock === "low") query = query.gt("stock", 0).lte("stock", 5);

  const { data, count } = await query;
  const products = (data ?? []) as unknown as ProductWithCategory[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6 sm:gap-4">
        <h1 className="min-w-0 font-body text-xl font-normal text-white sm:text-2xl lg:text-3xl">
          Products
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          <Suspense fallback={null}>
            <AdminFilterBar
              fields={[
                { name: "q", label: "Search", placeholder: "Name or slug" },
                {
                  name: "category",
                  label: "Category",
                  type: "select",
                  options: ((categories as Category[] | null) ?? []).map((c) => ({
                    value: c.slug,
                    label: c.name,
                  })),
                },
                {
                  name: "active",
                  label: "Visibility",
                  type: "select",
                  options: [
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Hidden" },
                  ],
                },
                {
                  name: "stock",
                  label: "Stock",
                  type: "select",
                  options: [
                    { value: "low", label: "Low (1–5)" },
                    { value: "out", label: "Out of stock" },
                  ],
                },
              ]}
            />
          </Suspense>
          <Button
            href="/admin/products/new"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            aria-label="Add product"
            title="Add product"
            className="h-9 w-9 gap-0 px-0 sm:w-auto sm:gap-1.5 sm:px-3.5"
          >
            <span className="hidden sm:inline">Add product</span>
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-glass-border bg-glass-bg px-4 py-8 text-center text-sm text-white/60 sm:p-10">
          No products match these filters.
        </div>
      ) : (
        <Table
          minWidth="min-w-[820px]"
          pagination={{
            page,
            totalPages,
            totalItems: total,
            perPage,
            pathname: "/admin/products",
            query: filters,
          }}
        >
          <THead>
            <Tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th align="right">Sell</Th>
              <Th align="right">Cost</Th>
              <Th align="right">Stock</Th>
              <Th>Status</Th>
              <Th align="right">Actions</Th>
            </Tr>
          </THead>
          <TBody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md">
                      <ProductImage
                        src={product.images[0] ?? null}
                        alt={product.name}
                        sizes="44px"
                      />
                    </div>
                    <p className="font-medium leading-snug text-white">
                      {product.name}
                    </p>
                  </div>
                </Td>
                <Td className="whitespace-nowrap text-white/60">
                  {product.category?.name ?? "—"}
                </Td>
                <Td
                  align="right"
                  className={cn("whitespace-nowrap", numeric)}
                >
                  {formatPrice(product.price)}
                </Td>
                <Td
                  align="right"
                  className={cn("whitespace-nowrap text-white/50", numeric)}
                >
                  {product.cost_price == null
                    ? "—"
                    : formatPrice(Number(product.cost_price))}
                </Td>
                <Td
                  align="right"
                  className={cn(
                    "whitespace-nowrap",
                    numeric,
                    product.stock <= 5 ? "text-amber-300" : "text-white/80",
                  )}
                >
                  {product.stock}
                </Td>
                <Td className="whitespace-nowrap">
                  <Badge tone={product.is_active ? "green" : "neutral"}>
                    {product.is_active ? "Active" : "Hidden"}
                  </Badge>
                </Td>
                <Td align="right" className="whitespace-nowrap">
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
