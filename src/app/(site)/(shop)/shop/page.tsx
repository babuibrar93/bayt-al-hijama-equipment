import type { Metadata } from "next";
import Link from "next/link";
import { SEO } from "@/constants/site";
import { siteUrl } from "@/lib/metadata";
import {
  getCategories,
  getProductsPage,
  type ProductSort,
} from "@/lib/products";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import Pagination from "@/components/ui/Pagination";
import JsonLd from "@/components/seo/JsonLd";
import {
  pageInner,
  pageShell,
  typeBody,
  typeBodySm,
  typeCardTitle,
  typeMeta,
  typeSectionTitle,
} from "@/lib/classes";
import {
  getBreadcrumbSchema,
  getShopItemListSchema,
} from "@/lib/structured-data";

export const revalidate = 300;

const SITE_URL = siteUrl;
const PER_PAGE = 16;

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
    page?: string;
  }>;
}

const SHOP_DESCRIPTION =
  "Browse premium Hijama equipment online. Hijama cups, complete kits, pumps, and consumables with nationwide delivery across Pakistan.";

export async function generateMetadata({
  searchParams,
}: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  // Search results and paginated/sorted views are kept out of the index to
  // prevent thin, duplicate listings; the canonical /shop stays indexable.
  const isFiltered =
    Boolean(params.search) ||
    Boolean(params.category) ||
    page > 1 ||
    (Boolean(params.sort) && params.sort !== "newest");

  return {
    title: { absolute: "Shop Hijama Equipment Online | Bayt Al Hijama" },
    description: SHOP_DESCRIPTION,
    keywords: [
      ...SEO.keywords,
      "Buy Hijama Equipment Online",
      "Hijama Shop Pakistan",
    ],
    alternates: { canonical: `${SITE_URL}/shop` },
    ...(isFiltered ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: "Shop Hijama Equipment | Bayt Al Hijama",
      description:
        "Browse premium Hijama equipment online with nationwide delivery across Pakistan.",
      url: `${SITE_URL}/shop`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Shop Hijama Equipment | Bayt Al Hijama",
      description: SHOP_DESCRIPTION,
    },
  };
}

const VALID_SORTS: ProductSort[] = ["newest", "price-asc", "price-desc", "name"];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const search = params.search ?? "";
  const page = Math.max(1, Number(params.page) || 1);
  const sort: ProductSort = VALID_SORTS.includes(params.sort as ProductSort)
    ? (params.sort as ProductSort)
    : "newest";

  const [{ products, total, totalPages }, categories] = await Promise.all([
    getProductsPage({ categorySlug, search, sort, page, perPage: PER_PAGE }),
    getCategories(),
  ]);

  const paginationQuery = {
    category: categorySlug,
    search: search || undefined,
    sort: sort !== "newest" ? sort : undefined,
  };

  return (
    <>
    <div className={pageShell}>
      <div className={pageInner}>
        <header className="mb-6 max-w-3xl">
          <h1 className={`mb-2 font-body font-medium text-white ${typeSectionTitle}`}>
            Shop Hijama Equipment
          </h1>
          <p className={`leading-relaxed text-white/70 ${typeBody}`}>
            {SHOP_DESCRIPTION} Prices are in Pakistani rupees. Shipping is
            confirmed after the order and is not included in the product price.
          </p>
        </header>
        <nav aria-label="Product categories" className="mb-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Browse by category
          </h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/shop/category/${category.slug}`}
                  className="text-sm text-white/75 transition-colors hover:text-gold"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ShopFilters
          categories={categories}
          activeCategory={categorySlug}
          activeSort={sort}
          activeSearch={search}
        >
          {products.length === 0 ? (
            <div className="rounded-lg border border-glass-border bg-glass-bg p-10 text-center">
              <p className={`${typeCardTitle} text-white/70`}>No products found.</p>
              <p className={`mt-2 text-white/50 ${typeBodySm}`}>
                Try a different search or category.
              </p>
            </div>
          ) : (
            <>
              <h2 className="sr-only">Products</h2>
              <p className={`mb-4 text-white/75 ${typeMeta}`}>
                Showing{" "}
                <span className="tabular-nums text-white/70">{products.length}</span>{" "}
                of <span className="tabular-nums text-white/70">{total}</span>{" "}
                products
              </p>
              <ProductGrid products={products} priorityCount={2} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                pathname="/shop"
                query={paginationQuery}
              />
            </>
          )}
        </ShopFilters>
      </div>

      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
          ]),
          getShopItemListSchema(products),
        ]}
      />
    </div>
    </>
  );
}
