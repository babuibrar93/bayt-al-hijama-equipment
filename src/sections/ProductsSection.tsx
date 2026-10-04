import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductGrid from "@/components/shop/ProductGrid";
import { getProducts } from "@/lib/products";
import {
  container,
  getRevealClass,
  section,
  typeBtn,
} from "@/lib/classes";

const HOME_PRODUCT_COUNT = 8;

export default async function ProductsSection() {
  const featured = await getProducts({
    featuredOnly: true,
    limit: HOME_PRODUCT_COUNT,
  });
  let products = featured;
  if (products.length < HOME_PRODUCT_COUNT) {
    const extras = await getProducts({ limit: HOME_PRODUCT_COUNT });
    const seen = new Set(products.map((p) => p.id));
    for (const product of extras) {
      if (seen.has(product.id)) continue;
      products = [...products, product];
      seen.add(product.id);
      if (products.length >= HOME_PRODUCT_COUNT) break;
    }
  }

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

        <div
          data-reveal
          className={`mt-5 ${getRevealClass("up")}`}
        >
          <ProductGrid products={products} />
        </div>

        <div className="mt-6 text-center sm:mt-8">
          <Link
            href="/shop"
            className={`inline-flex w-full items-center justify-center gap-2 rounded-sm border border-gold/40 px-6 py-3 font-semibold tracking-[0.04em] text-gold transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-gold/10 sm:w-auto sm:px-8 sm:py-3.5 ${typeBtn}`}
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
