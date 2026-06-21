import SectionHeader from "@/components/ui/SectionHeader";
import TrustIcon from "@/components/icons/TrustIcon";
import { TRUST_CARDS } from "@/constants/trust";
import { container, getRevealClass, section } from "@/lib/classes";

export default function TrustSection() {
  return (
    <section className={`${section} bg-black-2`} data-section id="trust" aria-label="Trust signals">
      <div className={container}>
        <SectionHeader
          eyebrow="Why Professionals Trust Us"
          title={
            <>
              Built for Practitioners.
              <br />
              <em>Designed for Excellence.</em>
            </>
          }
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {TRUST_CARDS.map((card, index) => (
            <div
              key={card.title}
              data-reveal
              data-tilt
              className={`group relative overflow-hidden rounded-lg border border-glass-border bg-glass-bg p-9 px-7 transition-all duration-[350ms] ease-spring hover:-translate-y-1.5 hover:border-gold/20 hover:bg-glass-bg-hover ${getRevealClass("up", (index + 1) as 1 | 2 | 3 | 4)}`}
            >
              <div className="pointer-events-none absolute inset-0 bg-trust-card-shine opacity-0 transition-opacity duration-[350ms] group-hover:opacity-100" />
              <div className="relative mb-6 h-14 w-14 [&_svg]:h-full [&_svg]:w-full">
                <TrustIcon iconId={card.iconId} />
              </div>
              <h3 className="relative mb-3 font-display text-[1.3rem] font-semibold text-white">
                {card.title}
              </h3>
              <p className="relative text-[0.9rem] leading-[1.75] text-white/60">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
