import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE, SEO } from "@/constants/site";
import { siteUrl } from "@/lib/metadata";
import {
  getCategories,
  getCategoryBySlug,
  getAllCategorySlugs,
  getProducts,
} from "@/lib/products";
import ProductCard from "@/components/shop/ProductCard";
import Breadcrumbs from "@/components/shop/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import {
  getBreadcrumbSchema,
  getShopItemListSchema,
  getWebPageSchema,
} from "@/lib/structured-data";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function categoryDescription(name: string, fallback: string | null): string {
  return (
    fallback ??
    `Shop premium ${name} from Bayt Al Hijama. Clinic-grade quality with nationwide delivery across Pakistan.`
  );
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const title = `${category.name} | Hijama Equipment`;
  const description = categoryDescription(category.name, category.description);
  const url = `${siteUrl}/shop/category/${category.slug}`;

  return {
    title,
    description,
    keywords: [...SEO.keywords, category.name, `Buy ${category.name} Pakistan`],
    alternates: { canonical: url },
    openGraph: {
      title: `${category.name} | ${SITE.shortName}`,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | ${SITE.shortName}`,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, categories] = await Promise.all([
    getProducts({ categorySlug: slug }),
    getCategories(),
  ]);

  const description = categoryDescription(category.name, category.description);
  const otherCategories = categories.filter((c) => c.slug !== slug);

  return (
    <div className="px-4 pb-20 pt-nav sm:px-6">
      <div className="mx-auto w-full max-w-container pt-8 sm:pt-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: category.name },
          ]}
        />

        <header className="mb-7 max-w-2xl">
          <span className="mb-3 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold before:h-px before:w-6 before:bg-gold before:content-['']">
            Category
          </span>
          <h1 className="mb-3 font-body text-[clamp(1.8rem,4vw,2.8rem)] font-normal leading-tight text-white">
            {category.name}
          </h1>
          <p className="text-sm text-white/60 sm:text-base">{description}</p>
        </header>

        {products.length === 0 ? (
          <div className="rounded-lg border border-glass-border bg-glass-bg p-10 text-center">
            <p className="text-lg text-white/70">
              No products in this category yet.
            </p>
            <Link
              href="/shop"
              className="mt-3 inline-block text-sm text-gold hover:text-gold-light"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-white/45">
              <span className="tabular-nums text-white/70">
                {products.length}
              </span>{" "}
              {products.length === 1 ? "product" : "products"}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 3}
                />
              ))}
            </div>
          </>
        )}

        <section
          className="mt-16 border-t border-glass-border pt-10"
          aria-label="About this category"
        >
          <h2 className="mb-3 font-body text-xl font-medium text-white">
            About {category.name}
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-white/55">
            {description} Every item is sourced for therapists, clinics, and
            students who need dependable, hygienic equipment. Order online with
            cash on delivery, bank transfer, JazzCash, or EasyPaisa, and have your{" "}
            {category.name.toLowerCase()} delivered anywhere in Pakistan.
          </p>

          {otherCategories.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                Explore other categories
              </h3>
              <ul className="flex flex-wrap gap-2.5">
                {otherCategories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/shop/category/${c.slug}`}
                      className="inline-block rounded-full border border-glass-border bg-glass-bg px-4 py-1.5 text-sm text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: category.name, path: `/shop/category/${category.slug}` },
          ]),
          getShopItemListSchema(products, `${category.name} — Hijama Equipment`),
          getWebPageSchema({
            path: `/shop/category/${category.slug}`,
            name: `${category.name} | ${SITE.shortName}`,
            description,
          }),
        ]}
      />
    </div>
  );
}
