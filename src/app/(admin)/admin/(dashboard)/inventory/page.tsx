import { Suspense } from "react";
import { AlertTriangle, Boxes, CheckCircle2, PackageX } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductImage from "@/components/shop/ProductImage";
import StockEditor from "@/components/admin/StockEditor";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import {
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
import type { BadgeTone } from "@/components/ui";
import { ADMIN_PAGE_SIZE, parsePage, parsePerPage } from "@/lib/admin/list-href";
import type { Product } from "@/types/db";

const LOW_STOCK_THRESHOLD = 5;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function param(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : "";
}

function stockBadge(stock: number): { tone: BadgeTone; label: string } {
  if (stock === 0) return { tone: "red", label: "Out of stock" };
  if (stock <= LOW_STOCK_THRESHOLD) return { tone: "amber", label: "Low" };
  return { tone: "green", label: "In stock" };
}

export default async function AdminInventoryPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = param(sp.q).trim();
  const stock = param(sp.stock);
  const page = parsePage(param(sp.page));
  const perPage = parsePerPage(param(sp.perPage), ADMIN_PAGE_SIZE);
  const filters = { q, stock };

  const supabase = await createClient();

  const [
    { count: totalCount },
    { count: lowCount },
    { count: outCount },
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .gt("stock", 0)
      .lte("stock", LOW_STOCK_THRESHOLD),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("stock", 0),
  ]);

  let listQuery = supabase
    .from("products")
    .select("id, name, images, stock, is_active", { count: "exact" })
    .order("stock", { ascending: true })
    .range((page - 1) * perPage, page * perPage - 1);

  if (q) {
    listQuery = listQuery.ilike("name", `%${q}%`);
  }
  if (stock === "out") listQuery = listQuery.eq("stock", 0);
  if (stock === "low") {
    listQuery = listQuery.gt("stock", 0).lte("stock", LOW_STOCK_THRESHOLD);
  }
  if (stock === "ok") listQuery = listQuery.gt("stock", LOW_STOCK_THRESHOLD);

  const { data, count } = await listQuery;

  const products = (data ?? []) as Pick<
    Product,
    "id" | "name" | "images" | "stock" | "is_active"
  >[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const catalogTotal = totalCount ?? 0;
  const lowStockCount = lowCount ?? 0;
  const outOfStock = outCount ?? 0;
  const inStock = Math.max(0, catalogTotal - lowStockCount - outOfStock);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-body text-xl font-normal text-white sm:text-2xl lg:text-3xl">
            Inventory
          </h1>
          <p className="mt-1 text-xs text-white/50 sm:mt-1.5 sm:text-sm">
            Use + / − or type a quantity, then press Update. Items at or below{" "}
            {LOW_STOCK_THRESHOLD} units are flagged.
          </p>
        </div>
        <div className="flex w-full justify-end sm:w-auto">
          <Suspense fallback={null}>
            <AdminFilterBar
              fields={[
                {
                  name: "q",
                  label: "Search",
                  placeholder: "Product name",
                },
                {
                  name: "stock",
                  label: "Stock",
                  type: "select",
                  options: [
                    { value: "ok", label: "In stock" },
                    { value: "low", label: "Low (1–5)" },
                    { value: "out", label: "Out of stock" },
                  ],
                },
              ]}
            />
          </Suspense>
        </div>
      </div>

      <StatGrid>
        <StatCard
          label="Total products"
          value={String(catalogTotal)}
          icon={Boxes}
        />
        <StatCard
          label="In stock"
          value={String(inStock)}
          icon={CheckCircle2}
        />
        <StatCard
          label="Low stock"
          value={String(lowStockCount)}
          icon={AlertTriangle}
          hint={`≤ ${LOW_STOCK_THRESHOLD} units`}
        />
        <StatCard
          label="Out of stock"
          value={String(outOfStock)}
          icon={PackageX}
        />
      </StatGrid>

      {products.length === 0 ? (
        <div className="rounded-lg border border-glass-border bg-glass-bg px-4 py-8 text-center text-sm text-white/60 sm:p-10">
          No products match these filters.
        </div>
      ) : (
        <Table
          minWidth="min-w-[640px]"
          pagination={{
            page,
            totalPages,
            totalItems: total,
            perPage,
            pathname: "/admin/inventory",
            query: filters,
          }}
        >
          <THead>
            <Tr>
              <Th>Product</Th>
              <Th>Status</Th>
              <Th align="right">Update stock</Th>
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
                    <StockEditor
                      id={product.id}
                      initialStock={product.stock}
                    />
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
