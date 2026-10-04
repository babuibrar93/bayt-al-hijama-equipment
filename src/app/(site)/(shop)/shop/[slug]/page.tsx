import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { SITE } from "@/constants/site";
import { WHATSAPP } from "@/constants/whatsapp";
import {
  getProductBySlug,
  getRelatedProducts,
  getAllProductSlugs,
} from "@/lib/products";
import { formatPrice } from "@/utils";
import {
  pageInner,
  pageShell,
  typeBody,
  typeBodySm,
  typeEyebrow,
  typeMeta,
  typeSectionTitle,
  typeStat,
} from "@/lib/classes";
import ProductImage from "@/components/shop/ProductImage";
import ProductGrid from "@/components/shop/ProductGrid";
import AddToCartButton from "@/components/shop/AddToCartButton";
import Breadcrumbs from "@/components/shop/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import {
  getProductSchema,
  getBreadcrumbSchema,
} from "@/lib/structured-data";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = `${product.name} | ${SITE.shortName}`;
  const description = product.description.slice(0, 160);
  const image = product.images[0] ?? `${SITE_URL}/og-default.jpg`;
  const url = `${SITE_URL}/shop/${product.slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const mainImage = product.images[0] ?? null;
  const inStock = product.stock > 0;

  const whatsappUrl = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
    `Assalamu Alaikum! I'm interested in the ${product.name} (${formatPrice(product.price)}). Please share details.`,
  )}`;

  return (
    <div className={pageShell}>
      <div className={pageInner}>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            ...(product.category
              ? [
                  {
                    label: product.category.name,
                    href: `/shop/category/${product.category.slug}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border border-glass-border bg-glass-bg">
              <ProductImage
                src={mainImage}
                alt={product.name}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
                {product.images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-sm border border-glass-border"
                  >
                    <ProductImage
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      sizes="120px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.category && (
              <Link
                href={`/shop/category/${product.category.slug}`}
                className={`mb-3 inline-flex min-h-12 items-center font-semibold uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-light ${typeEyebrow}`}
              >
                {product.category.name}
              </Link>
            )}
            <h1
              className={`mb-4 font-body font-normal leading-tight text-white ${typeSectionTitle}`}
            >
              {product.name}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-3 sm:gap-4">
              <span
                className={`font-body font-semibold text-white ${typeStat}`}
              >
                {formatPrice(product.price)}
              </span>
              {inStock ? (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg bg-green-mid/20 px-3 py-1 font-medium text-green-light ${typeMeta}`}
                >
                  <Check className="h-3.5 w-3.5" /> In Stock
                </span>
              ) : (
                <span
                  className={`rounded-lg bg-white/10 px-3 py-1 font-medium text-white/60 ${typeMeta}`}
                >
                  Out of Stock
                </span>
              )}
            </div>

            <p
              className={`mb-8 leading-relaxed text-white/70 ${typeBody}`}
            >
              {product.description}
            </p>

            {product.features.length > 0 && (
              <ul className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2" role="list">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-start gap-2.5 text-white/75 ${typeBodySm}`}
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <div className="mb-6">
              <AddToCartButton
                product={{
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: mainImage,
                  maxStock: product.stock,
                }}
                withQuantity
              />
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mb-8 inline-flex items-center gap-2 font-medium text-white/70 transition-colors hover:text-gold ${typeBodySm}`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Prefer WhatsApp? Order directly
            </a>

            <div
              className={`flex flex-col gap-3 border-t border-glass-border pt-6 text-white/60 ${typeBodySm}`}
            >
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gold" aria-hidden="true" />
                Nationwide delivery across Pakistan
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-gold" aria-hidden="true" />
                100% authentic, clinic-grade equipment
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20" aria-label="Related products">
            <h2
              className={`mb-8 font-body font-medium text-white ${typeSectionTitle}`}
            >
              You may also like
            </h2>
            <ProductGrid products={related} priorityCount={0} />
          </section>
        )}
      </div>

      <JsonLd
        data={[
          getProductSchema(product),
          getBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            ...(product.category
              ? [
                  {
                    name: product.category.name,
                    path: `/shop/category/${product.category.slug}`,
                  },
                ]
              : []),
            { name: product.name, path: `/shop/${product.slug}` },
          ]),
        ]}
      />
    </div>
  );
}
