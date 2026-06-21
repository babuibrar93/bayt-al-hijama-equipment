import SectionHeader from "@/components/ui/SectionHeader";
import ProductIcon from "@/components/icons/ProductIcon";
import { PRODUCTS } from "@/constants/products";
import { getBadgeClass, getRevealClass } from "@/utils";

export default function ProductsSection() {
  return (
    <section className="products section" id="products" aria-label="Featured products">
      <div className="container">
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

        <div className="products__grid">
          {PRODUCTS.map((product, index) => (
            <article
              key={product.id}
              className={`product-card ${getRevealClass("up", (index + 1) as 1 | 2 | 3 | 4)}`}
              aria-label={product.title}
            >
              <div className="product-card__glow" aria-hidden="true" />
              <div className="product-card__inner">
                <div className={getBadgeClass(product.badgeVariant)}>
                  {product.badge}
                </div>
                <div className="product-card__visual">
                  <div className="product-card__icon-wrap">
                    <ProductIcon iconId={product.iconId} />
                  </div>
                </div>
                <div className="product-card__content">
                  <h3 className="product-card__title">{product.title}</h3>
                  <p className="product-card__desc">{product.description}</p>
                  <ul className="product-card__features">
                    {product.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <a
                    href={product.whatsappUrl}
                    className="product-card__cta"
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
