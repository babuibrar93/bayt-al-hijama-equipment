import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "@/lib/fallback-data";
import type { Category, ProductWithCategory } from "@/types/db";

/**
 * Cookie-less Supabase client for public, read-only data. Safe to call from
 * statically generated / ISR pages and generateStaticParams (no request scope
 * required). Public reads are governed by the anon RLS policies.
 */
function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export type ProductSort = "newest" | "price-asc" | "price-desc" | "name";

export interface ProductQuery {
  categorySlug?: string;
  search?: string;
  sort?: ProductSort;
  featuredOnly?: boolean;
  limit?: number;
}

export interface PaginatedProducts {
  products: ProductWithCategory[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

const PRODUCT_SELECT =
  "*, category:categories(id, name, slug)";

async function resolveCategoryId(slug: string): Promise<string | null> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  return data?.id ?? null;
}

function sortFallback(
  products: ProductWithCategory[],
  sort: ProductSort,
): ProductWithCategory[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return copy;
  }
}

export async function getProducts(
  query: ProductQuery = {},
): Promise<ProductWithCategory[]> {
  const { categorySlug, search, sort = "newest", featuredOnly, limit } = query;

  if (!isSupabaseConfigured()) {
    let items = FALLBACK_PRODUCTS.filter((p) => p.is_active);
    if (featuredOnly) items = items.filter((p) => p.is_featured);
    if (categorySlug)
      items = items.filter((p) => p.category?.slug === categorySlug);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    items = sortFallback(items, sort);
    return typeof limit === "number" ? items.slice(0, limit) : items;
  }

  const supabase = createStaticClient();
  let builder = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true);

  if (featuredOnly) builder = builder.eq("is_featured", true);
  if (search) {
    builder = builder.or(
      `name.ilike.%${search}%,description.ilike.%${search}%`,
    );
  }
  if (categorySlug) {
    const categoryId = await resolveCategoryId(categorySlug);
    if (!categoryId) return [];
    builder = builder.eq("category_id", categoryId);
  }

  const [column, ascending] = SORT_MAP[sort];
  builder = builder.order(column, { ascending });
  if (typeof limit === "number") builder = builder.limit(limit);

  const { data, error } = await builder;
  if (error || !data) return [];
  return data as unknown as ProductWithCategory[];
}

const SORT_MAP: Record<ProductSort, [string, boolean]> = {
  newest: ["created_at", false],
  "price-asc": ["price", true],
  "price-desc": ["price", false],
  name: ["name", true],
};

/**
 * Paginated, server-side filtered product listing for the shop page.
 */
export async function getProductsPage(
  query: ProductQuery & { page?: number; perPage?: number } = {},
): Promise<PaginatedProducts> {
  const {
    categorySlug,
    search,
    sort = "newest",
    page = 1,
    perPage = 9,
  } = query;
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * perPage;
  const to = from + perPage - 1;

  if (!isSupabaseConfigured()) {
    let items = FALLBACK_PRODUCTS.filter((p) => p.is_active);
    if (categorySlug)
      items = items.filter((p) => p.category?.slug === categorySlug);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    items = sortFallback(items, sort);
    const total = items.length;
    return {
      products: items.slice(from, from + perPage),
      total,
      page: safePage,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
  }

  const supabase = createStaticClient();
  let builder = supabase
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" })
    .eq("is_active", true);

  if (search) {
    builder = builder.or(
      `name.ilike.%${search}%,description.ilike.%${search}%`,
    );
  }
  if (categorySlug) {
    const categoryId = await resolveCategoryId(categorySlug);
    if (!categoryId) {
      return { products: [], total: 0, page: safePage, perPage, totalPages: 1 };
    }
    builder = builder.eq("category_id", categoryId);
  }

  const [column, ascending] = SORT_MAP[sort];
  builder = builder.order(column, { ascending }).range(from, to);

  const { data, count, error } = await builder;
  if (error || !data) {
    return { products: [], total: 0, page: safePage, perPage, totalPages: 1 };
  }

  const total = count ?? 0;
  return {
    products: data as unknown as ProductWithCategory[],
    total,
    page: safePage,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithCategory | null> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as ProductWithCategory;
}

export async function getRelatedProducts(
  product: ProductWithCategory,
  limit = 3,
): Promise<ProductWithCategory[]> {
  const all = await getProducts({
    categorySlug: product.category?.slug,
  });
  return all.filter((p) => p.id !== product.id).slice(0, limit);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }

  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as Category;
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const categories = await getCategories();
  return categories.map((c) => c.slug);
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_CATEGORIES;
  }

  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as Category[];
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_PRODUCTS.map((p) => p.slug);
  }

  // Uses a cookie-less client so it is safe to call from generateStaticParams.
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);

  return (data ?? []).map((p) => p.slug as string);
}
