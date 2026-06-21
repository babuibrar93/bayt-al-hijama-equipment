import SectionHeader from "@/components/ui/SectionHeader";
import CategoryIcon from "@/components/icons/CategoryIcon";
import { CATEGORIES } from "@/constants/categories";
import { getRevealClass } from "@/utils";

export default function CategoriesSection() {
  return (
    <section className="categories section" id="categories" aria-label="Product categories">
      <div className="container">
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

        <div className="categories__grid">
          {CATEGORIES.map((category, index) => (
            <div
              key={category.title}
              className={`cat-card ${getRevealClass("up", (index + 1) as 1 | 2 | 3 | 4)}`}
            >
              <div className="cat-card__number" aria-hidden="true">
                {category.number}
              </div>
              <div className="cat-card__icon">
                <CategoryIcon iconId={category.iconId} />
              </div>
              <h3 className="cat-card__title">{category.title}</h3>
              <p className="cat-card__desc">{category.description}</p>
              <a
                href={category.whatsappUrl}
                className="cat-card__link"
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
