import type { Metadata } from "next";
import { SITE, SEO } from "@/constants/site";
import {
  getCategories,
  getProductsPage,
  type ProductSort,
} from "@/lib/products";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import Breadcrumbs from "@/components/shop/Breadcrumbs";
import Pagination from "@/components/ui/Pagination";
import JsonLd from "@/components/seo/JsonLd";
import { cn } from "@/lib/classes";
import {
  getBreadcrumbSchema,
  getShopItemListSchema,
} from "@/lib/structured-data";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;
const PER_PAGE = 9;

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
    view?: string;
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
  const view = params.view === "list" ? "list" : "grid";
  const page = Math.max(1, Number(params.page) || 1);
  const sort: ProductSort = VALID_SORTS.includes(params.sort as ProductSort)
    ? (params.sort as ProductSort)
    : "newest";

  const [{ products, total, totalPages }, categories] = await Promise.all([
    getProductsPage({ categorySlug, search, sort, page, perPage: PER_PAGE }),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  const buildHref = (targetPage: number) => {
    const sp = new URLSearchParams();
    if (categorySlug) sp.set("category", categorySlug);
    if (search) sp.set("search", search);
    if (sort !== "newest") sp.set("sort", sort);
    if (view === "list") sp.set("view", "list");
    if (targetPage > 1) sp.set("page", String(targetPage));
    const qs = sp.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  return (
    <div className="px-4 pb-20 pt-nav sm:px-6">
      <div className="mx-auto w-full max-w-container pt-8 sm:pt-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

        <header className="mb-7 max-w-2xl">
          <span className="mb-3 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold before:h-px before:w-6 before:bg-gold before:content-['']">
            Online Store
          </span>
          <h1 className="mb-3 font-body text-[clamp(1.8rem,4vw,2.8rem)] font-normal leading-tight text-white">
            {activeCategory ? activeCategory.name : "Shop Hijama Equipment"}
          </h1>
          <p className="text-sm text-white/60 sm:text-base">
            {activeCategory?.description ??
              "Professional-grade Hijama cups, kits, and accessories trusted by therapists across Pakistan. Nationwide delivery."}
          </p>
        </header>

        <ShopFilters
          categories={categories}
          activeCategory={categorySlug}
          activeSort={sort}
          activeSearch={search}
          activeView={view}
        />

        {products.length === 0 ? (
          <div className="rounded-lg border border-glass-border bg-glass-bg p-10 text-center">
            <p className="text-lg text-white/70">No products found.</p>
            <p className="mt-2 text-sm text-white/50">
              Try a different search or category.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-white/45">
              Showing{" "}
              <span className="tabular-nums text-white/70">{products.length}</span>{" "}
              of <span className="tabular-nums text-white/70">{total}</span>{" "}
              products
            </p>
            <div
              className={cn(
                view === "list"
                  ? "flex flex-col gap-4"
                  : "grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3",
              )}
            >
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 3}
                  view={view}
                />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              buildHref={buildHref}
            />
          </>
        )}
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
  );
}
