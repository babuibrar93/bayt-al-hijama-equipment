import Link from "next/link";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductIcon from "@/components/icons/ProductIcon";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { getProducts } from "@/lib/products";
import { formatPrice } from "@/utils";
import { SITE } from "@/constants/site";
import {
  container,
  getBadgeClass,
  getRevealClass,
  productBadgeScrim,
  section,
} from "@/lib/classes";

const ICON_BY_SLUG: Record<string, string> = {
  "vacuum-pump-hijama-kit": "vacuum-kit",
  "premium-silicone-cup-set": "silicone-set",
  "complete-clinic-starter-kit": "clinic-kit",
};

function iconForSlug(slug: string): string {
  return ICON_BY_SLUG[slug] ?? "vacuum-kit";
}

export default async function ProductsSection() {
  const featured = await getProducts({ featuredOnly: true, limit: 3 });
  const products = featured.length > 0 ? featured : await getProducts({ limit: 3 });

  return (
    <section
      className={`${section} bg-black-3`}
      data-section
      id="products"
      aria-label="Featured products"
    >
      <div className={container}>
        <SectionHeader
          eyebrow="Our Products"
          title={
            <>
              Equipment That Elevates <em>Every Session</em>
            </>
          }
          subtitle="Professional-grade tools, authentically sourced, delivered with care."
        />

        <div className="mt-5 grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 min-[520px]:gap-4 xl:grid-cols-3 xl:[&>article:last-child:nth-child(odd)]:col-span-1">
          {products.map((product, index) => {
            const image = product.images[0];
            const whatsappUrl = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
              `Assalamu Alaikum! I'm interested in the ${product.name}. Please share details.`,
            )}`;
            return (
              <article
                key={product.id}
                data-reveal
                data-tilt
                aria-label={product.name}
                className={`group relative overflow-hidden rounded-xl border border-glass-border bg-glass-bg transition-all duration-[400ms] ease-spring hover:-translate-y-2.5 hover:border-gold/25 min-[520px]:max-xl:[&:last-child:nth-child(odd)]:col-span-2 min-[520px]:max-xl:[&:last-child:nth-child(odd)]:mx-auto min-[520px]:max-xl:[&:last-child:nth-child(odd)]:max-w-[min(100%,28rem)] ${getRevealClass("up", (index + 1) as 1 | 2 | 3 | 4)}`}
              >
                <div className="pointer-events-none absolute -inset-px z-0 animate-border-spin rounded-[inherit] bg-product-glow opacity-0 [animation-play-state:paused] group-hover:opacity-100 group-hover:[animation-play-state:running]" />
                <div className="relative z-[1] flex h-full flex-col">
                  {product.badge && (
                    <div className={getBadgeClass(product.badge_variant)}>
                      {product.badge}
                    </div>
                  )}
                  <Link
                    href={`/shop/${product.slug}`}
                    className="block"
                    aria-label={`View ${product.name}`}
                  >
                    {image ? (
                      <div className="relative min-h-[140px] overflow-hidden bg-product-visual sm:min-h-[160px]">
                        {product.badge ? (
                          <span className={productBadgeScrim} aria-hidden="true" />
                        ) : null}
                        <Image
                          src={image}
                          alt={product.name}
                          width={400}
                          height={300}
                          sizes="(max-width: 519px) 100vw, (max-width: 1279px) 50vw, 33vw"
                          className="h-[150px] w-full object-cover transition-transform duration-[400ms] ease-spring sm:h-[170px] md:h-[180px] group-hover:scale-[1.05]"
                        />
                      </div>
                    ) : (
                      <div className="flex min-h-[140px] items-center justify-center bg-product-visual px-6 py-8 sm:min-h-[160px] md:min-h-[180px]">
                        <div className="h-[72px] w-[72px] transition-transform duration-[400ms] ease-spring group-hover:scale-[1.08] group-hover:-translate-y-1 sm:h-[80px] sm:w-[80px] [&_svg]:h-full [&_svg]:w-full">
                          <ProductIcon iconId={iconForSlug(product.slug)} />
                        </div>
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
                    <div className="mb-2 flex items-start justify-between gap-2 sm:gap-3">
                      <h3 className="min-w-0 font-body text-[0.9375rem] font-semibold leading-snug text-white sm:text-base md:text-lg">
                        <Link
                          href={`/shop/${product.slug}`}
                          className="transition-colors hover:text-gold"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      <span className="shrink-0 font-body text-[0.8125rem] font-semibold tabular-nums text-gold sm:text-sm md:text-base">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <p className="mb-3 line-clamp-2 text-[0.78rem] leading-[1.6] text-white/60 sm:text-[0.8rem] md:text-[0.85rem]">
                      {product.description}
                    </p>
                    <ul className="mb-4 hidden flex-col gap-1 md:flex">
                      {product.features.slice(0, 3).map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-[0.75rem] text-white/60 before:text-[0.55rem] before:text-gold before:content-['✦']"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-col gap-2">
                      <AddToCartButton
                        product={{
                          productId: product.id,
                          slug: product.slug,
                          name: product.name,
                          price: product.price,
                          image: image ?? null,
                          maxStock: product.stock,
                        }}
                        className="w-full justify-center px-3 py-2 text-[0.75rem] sm:text-[0.78rem] md:text-[0.82rem]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/shop/${product.slug}`}
                          className="flex items-center justify-center rounded-sm border border-glass-border px-2 py-2 text-center text-[0.7rem] font-semibold tracking-[0.04em] text-white/80 transition-all duration-[250ms] hover:-translate-y-px hover:border-gold/40 hover:text-gold sm:px-3 sm:text-[0.75rem] md:text-[0.78rem]"
                        >
                          Details
                        </Link>
                        <a
                          href={whatsappUrl}
                          className="flex items-center justify-center rounded-sm border border-glass-border px-2 py-2 text-center text-[0.7rem] font-semibold tracking-[0.04em] text-white/80 transition-all duration-[250ms] hover:-translate-y-px hover:border-green-mid hover:bg-green-mid hover:text-white sm:px-3 sm:text-[0.75rem] md:text-[0.78rem]"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 text-center sm:mt-8">
          <Link
            href="/shop"
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-gold/40 px-6 py-3 text-[0.82rem] font-semibold tracking-[0.04em] text-gold transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-gold/10 sm:w-auto sm:px-8 sm:py-3.5 sm:text-[0.88rem]"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
