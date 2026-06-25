import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import CategoryIcon from "@/components/icons/CategoryIcon";
import { getCategories } from "@/lib/products";
import {
  container,
  featureCard,
  featureCardIcon,
  featureCardIndex,
  getRevealClass,
  section,
} from "@/lib/classes";

const ICON_BY_SLUG: Record<string, string> = {
  "hijama-cups": "cups",
  "complete-kits": "kits",
  accessories: "accessories",
  consumables: "consumables",
};

function iconForSlug(slug: string): string {
  return ICON_BY_SLUG[slug] ?? "cups";
}

export default async function CategoriesSection() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <section
      data-section
      className={section}
      id="categories"
      aria-label="Product categories"
    >
      <div className={container}>
        <SectionHeader
          eyebrow="What We Offer"
          title={
            <>
              Everything You Need <em>In One Place</em>
            </>
          }
          subtitle="Cups, kits, accessories, and consumables — all in one place."
        />

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/shop/category/${category.slug}`}
              data-reveal
              data-tilt
              aria-label={`Shop ${category.name}`}
              className={`${featureCard} flex h-full flex-col p-4 sm:p-5 ${getRevealClass("up", ((index % 4) + 1) as 1 | 2 | 3 | 4)}`}
            >
              <div className="pointer-events-none absolute inset-0 bg-trust-card-shine opacity-0 transition-opacity duration-[350ms] group-hover:opacity-100" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-grad-gold transition-transform duration-[400ms] ease-out group-hover:scale-x-100" />

              <div className="relative mb-3 flex items-start justify-between gap-2">
                <div className={featureCardIcon}>
                  <CategoryIcon iconId={iconForSlug(category.slug)} />
                </div>
                <span className={featureCardIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="relative mb-1.5 font-body text-[0.95rem] font-semibold leading-snug text-white sm:text-[1.1rem]">
                {category.name}
              </h3>

              {category.description && (
                <p className="relative mb-3 line-clamp-2 flex-1 text-[0.78rem] leading-[1.55] text-white/60 sm:text-[0.82rem]">
                  {category.description}
                </p>
              )}

              <span className="relative mt-auto text-[0.75rem] font-semibold tracking-[0.06em] text-gold transition-all duration-[250ms] group-hover:tracking-[0.1em] sm:text-[0.8rem]">
                Explore Range →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
