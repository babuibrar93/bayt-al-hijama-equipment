import SectionHeader from "@/components/ui/SectionHeader";
import { TIMELINE_ITEMS } from "@/constants/why";
import { getRevealClass } from "@/utils";

export default function WhySection() {
  return (
    <section className="why section" id="why" aria-label="Why choose us">
      <div className="why__bg-pattern" aria-hidden="true" />
      <div className="container">
        <SectionHeader
          eyebrow="Our Promise"
          title={
            <>
              Not Just a Supplier —
              <br />
              <em>Your Practice Partner</em>
            </>
          }
        />

        <div className="timeline">
          {TIMELINE_ITEMS.map((item) => (
            <div
              key={item.number}
              className={`timeline__item ${getRevealClass(item.direction === "left" ? "left" : "right")}`}
            >
              <div className="timeline__dot">
                <span>{item.number}</span>
              </div>
              <div className="timeline__content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
