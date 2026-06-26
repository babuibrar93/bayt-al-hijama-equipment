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
import PageHeader from "@/components/shop/PageHeader";
import JsonLd from "@/components/seo/JsonLd";
import {
  getBreadcrumbSchema,
  getShopItemListSchema,
  getWebPageSchema,
} from "@/lib/structured-data";
import { pageInner, pageShell } from "@/lib/classes";

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
    <div className={pageShell}>
      <div className={pageInner}>
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: category.name },
          ]}
          eyebrow="Category"
          description={description}
        />

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
            <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 min-[520px]:gap-4 lg:grid-cols-3 lg:gap-5">
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
                      className="inline-block rounded-lg border border-glass-border bg-glass-bg px-4 py-1.5 text-sm text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
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
