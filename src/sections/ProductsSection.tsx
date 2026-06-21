import SectionHeader from "@/components/ui/SectionHeader";
import ProductIcon from "@/components/icons/ProductIcon";
import { PRODUCTS } from "@/constants/products";
import {
  container,
  getBadgeClass,
  getRevealClass,
  section,
} from "@/lib/classes";

export default function ProductsSection() {
  return (
    <section className={`${section} bg-black-3`} data-section id="products" aria-label="Featured products">
      <div className={container}>
        <SectionHeader
          eyebrow="Our Products"
          title={
            <>
              Equipment That Elevates
              <br />
              <em>Every Session</em>
            </>
          }
          subtitle="Professional-grade tools, authentically sourced, delivered with care."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 [&>article:last-child]:max-md:mx-auto [&>article:last-child]:max-md:max-w-full md:[&>article:last-child]:col-span-2 md:[&>article:last-child]:mx-auto md:[&>article:last-child]:max-w-[50%] xl:[&>article:last-child]:col-span-1 xl:[&>article:last-child]:max-w-none">
          {PRODUCTS.map((product, index) => (
            <article
              key={product.id}
              data-reveal
              data-tilt
              aria-label={product.title}
              className={`group relative cursor-default overflow-hidden rounded-xl border border-glass-border bg-glass-bg transition-all duration-[400ms] ease-spring hover:-translate-y-2.5 hover:border-gold/25 ${getRevealClass("up", (index + 1) as 1 | 2 | 3 | 4)}`}
            >
              <div className="pointer-events-none absolute -inset-px z-0 animate-border-spin rounded-[inherit] bg-product-glow opacity-0 [animation-play-state:paused] group-hover:opacity-100 group-hover:[animation-play-state:running]" />
              <div className="relative z-[1]">
                <div className={getBadgeClass(product.badgeVariant)}>
                  {product.badge}
                </div>
                <div className="flex min-h-[200px] items-center justify-center bg-product-visual px-10 pb-8 pt-14">
                  <div className="h-[120px] w-[120px] transition-transform duration-[400ms] ease-spring group-hover:scale-[1.08] group-hover:-translate-y-1 [&_svg]:h-full [&_svg]:w-full">
                    <ProductIcon iconId={product.iconId} />
                  </div>
                </div>
                <div className="px-7 pb-8 pt-2">
                  <h3 className="mb-3 font-display text-2xl font-semibold text-white">
                    {product.title}
                  </h3>
                  <p className="mb-5 text-[0.88rem] leading-[1.7] text-white/60">
                    {product.description}
                  </p>
                  <ul className="mb-7 flex flex-col gap-1.5">
                    {product.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-[0.8rem] text-white/60 before:text-[0.6rem] before:text-gold before:content-['✦']"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={product.whatsappUrl}
                    className="flex items-center justify-center rounded-sm border border-glass-border px-6 py-3.5 text-center text-[0.82rem] font-semibold tracking-[0.06em] text-white/80 transition-all duration-[250ms] hover:-translate-y-px hover:border-green-mid hover:bg-green-mid hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Enquire on WhatsApp
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
