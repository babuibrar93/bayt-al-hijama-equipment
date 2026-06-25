import SectionHeader from "@/components/ui/SectionHeader";
import TrustIcon from "@/components/icons/TrustIcon";
import { TRUST_CARDS } from "@/constants/trust";
import {
  container,
  featureCard,
  featureCardIcon,
  featureCardIndex,
  getRevealClass,
  section,
} from "@/lib/classes";

export default function TrustSection() {
  return (
    <section className={section} data-section id="trust" aria-label="Trust signals">
      <div className={container}>
        <SectionHeader
          eyebrow="Why Professionals Trust Us"
          title={
            <>
              Built for Practitioners, <em>Designed for Excellence</em>
            </>
          }
          subtitle="Clinic-grade equipment trusted by therapists and clinics nationwide."
        />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {TRUST_CARDS.map((card, index) => (
            <div
              key={card.title}
              data-reveal
              data-tilt
              className={`${featureCard} p-5 ${getRevealClass("up", (index + 1) as 1 | 2 | 3 | 4)}`}
            >
              <div className="pointer-events-none absolute inset-0 bg-trust-card-shine opacity-0 transition-opacity duration-[350ms] group-hover:opacity-100" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-grad-gold transition-transform duration-[400ms] ease-out group-hover:scale-x-100" />

              <div className="relative mb-3 flex items-center justify-between gap-3">
                <div className={featureCardIcon}>
                  <TrustIcon iconId={card.iconId} />
                </div>
                <span className={featureCardIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="relative mb-1.5 font-body text-[1.05rem] font-semibold leading-snug text-white">
                {card.title}
              </h3>
              <p className="relative text-[0.85rem] leading-[1.65] text-white/60">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
