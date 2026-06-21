import SectionHeader from "@/components/ui/SectionHeader";
import CategoryIcon from "@/components/icons/CategoryIcon";
import { CATEGORIES } from "@/constants/categories";
import { container, getRevealClass, section } from "@/lib/classes";

export default function CategoriesSection() {
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

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {CATEGORIES.map((category, index) => (
            <div
              key={category.title}
              data-reveal
              data-tilt
              className={`group relative overflow-hidden rounded-lg border border-glass-border bg-glass-bg px-7 pb-8 pt-9 transition-all duration-[350ms] ease-spring after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-grad-gold after:transition-transform after:duration-[400ms] after:ease-out hover:-translate-y-2 hover:border-gold/20 hover:bg-glass-bg-hover hover:after:scale-x-100 ${getRevealClass("up", (index + 1) as 1 | 2 | 3 | 4)}`}
            >
              <div
                className="pointer-events-none absolute right-6 top-5 select-none font-display text-[3.5rem] font-bold leading-none text-gold/[0.06]"
                aria-hidden="true"
              >
                {category.number}
              </div>
              <div className="relative mb-6 h-14 w-14 [&_svg]:h-full [&_svg]:w-full">
                <CategoryIcon iconId={category.iconId} />
              </div>
              <h3 className="relative mb-3 font-display text-[1.35rem] font-semibold text-white">
                {category.title}
              </h3>
              <p className="relative mb-6 text-[0.87rem] leading-[1.7] text-white/60">
                {category.description}
              </p>
              <a
                href={category.whatsappUrl}
                className="relative text-[0.8rem] font-semibold tracking-[0.06em] text-gold transition-all duration-[250ms] group-hover:tracking-[0.12em]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore Range →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
