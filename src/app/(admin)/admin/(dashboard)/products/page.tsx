import Link from "next/link";
import { Suspense } from "react";
import {
  AlertTriangle,
  Eye,
  Package,
  PackageX,
  Pencil,
  Plus,
} from "lucide-react";
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
  StatCard,
  StatGrid,
} from "@/components/ui";
import { ADMIN_PAGE_SIZE, parsePage, parsePerPage } from "@/lib/admin/list-href";
import { fetchProductCatalogStats } from "@/lib/admin/queries";
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
  const stock = param(sp.stock);
  const page = parsePage(param(sp.page));
  const perPage = parsePerPage(param(sp.perPage), ADMIN_PAGE_SIZE);
  const filters = { q, category, stock };

  const supabase = await createClient();

  const [{ data: categoriesData }, catalogStats] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug")
      .order("sort_order"),
    fetchProductCatalogStats(supabase),
  ]);

  const categories = (categoriesData ?? []) as Category[];

  let listQuery = supabase
    .from("products")
    .select(
      "id, name, slug, price, cost_price, stock, images, is_active, created_at, category:categories(id, name, slug)",
      { count: "exact" },
    )
    .order("updated_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (q) {
    listQuery = listQuery.or(`name.ilike.%${q}%,slug.ilike.%${q}%`);
  }
  if (category) {
    const cat = categories.find((c) => c.slug === category);
    if (cat) listQuery = listQuery.eq("category_id", cat.id);
  }
  if (stock === "out") listQuery = listQuery.eq("stock", 0);
  if (stock === "low") listQuery = listQuery.gt("stock", 0).lte("stock", 5);

  const { data, count } = await listQuery;
  const products = (data ?? []) as unknown as ProductWithCategory[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div>
      <StatGrid>
        <StatCard
          label="Total products"
          value={String(catalogStats.total)}
          icon={Package}
        />
        <StatCard
          label="Active"
          value={String(catalogStats.active)}
          icon={Eye}
        />
        <StatCard
          label="Low stock"
          value={String(catalogStats.low)}
          icon={AlertTriangle}
          hint="1–5 units"
        />
        <StatCard
          label="Out of stock"
          value={String(catalogStats.out)}
          icon={PackageX}
        />
      </StatGrid>

      <Suspense fallback={null}>
        <AdminFilterBar
          fields={[
            { name: "q", label: "Search", placeholder: "Search name or slug" },
            {
              name: "category",
              label: "Category",
              type: "select",
              options: categories.map((c) => ({
                value: c.slug,
                label: c.name,
              })),
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
          actions={
            <Button
              href="/admin/products/new"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              aria-label="Add product"
              title="Add product"
              className="h-11 w-full justify-center gap-1.5 px-3.5 sm:w-auto"
            >
              <span>Add product</span>
            </Button>
          }
        />
      </Suspense>

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
                  <div className="flex items-center gap-3">
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
