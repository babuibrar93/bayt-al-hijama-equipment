import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import CategoryIcon from "@/components/icons/CategoryIcon";
import { getCategories } from "@/lib/products";
import { container, getRevealClass, section } from "@/lib/classes";

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
      className={`${section} bg-black-2`}
      id="categories"
      aria-label="Product categories"
    >
      <div className={container}>
        <SectionHeader
          eyebrow="What We Offer"
          title={
            <>
              Everything You Need
              <br />
              <em>In One Place</em>
            </>
          }
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              data-reveal
              data-tilt
              aria-label={`Shop ${category.name}`}
              className={`group relative block overflow-hidden rounded-lg border border-glass-border bg-glass-bg px-4 pb-5 pt-5 transition-all duration-[350ms] ease-spring after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-grad-gold after:transition-transform after:duration-[400ms] after:ease-out hover:-translate-y-1.5 hover:border-gold/20 hover:bg-glass-bg-hover hover:after:scale-x-100 sm:px-6 sm:pb-7 sm:pt-7 ${getRevealClass("up", ((index % 4) + 1) as 1 | 2 | 3 | 4)}`}
            >
              <div
                className="pointer-events-none absolute right-5 top-4 select-none font-display text-[2.75rem] font-bold leading-none text-gold/[0.06] sm:text-[3.5rem]"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="relative mb-4 h-11 w-11 [&_svg]:h-full [&_svg]:w-full sm:mb-5 sm:h-14 sm:w-14">
                <CategoryIcon iconId={iconForSlug(category.slug)} />
              </div>
              <h3 className="relative mb-2 font-display text-lg font-semibold text-white sm:text-[1.35rem]">
                {category.name}
              </h3>
              {category.description && (
                <p className="relative mb-4 text-[0.82rem] leading-[1.6] text-white/60 sm:text-[0.87rem]">
                  {category.description}
                </p>
              )}
              <span className="relative text-[0.8rem] font-semibold tracking-[0.06em] text-gold transition-all duration-[250ms] group-hover:tracking-[0.12em]">
                Explore Range →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
