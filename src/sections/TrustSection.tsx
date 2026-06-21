import SectionHeader from "@/components/ui/SectionHeader";
import { TRUST_CARDS } from "@/constants/trust";
import TrustIcon from "@/components/icons/TrustIcon";
import { getRevealClass } from "@/utils";

export default function TrustSection() {
  return (
    <section className="trust section" id="trust" aria-label="Trust signals">
      <div className="container">
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

        <div className="trust__grid">
          {TRUST_CARDS.map((card, index) => (
            <div
              key={card.title}
              className={`trust__card ${getRevealClass("up", (index + 1) as 1 | 2 | 3 | 4)}`}
            >
              <div className="trust__card-icon">
                <TrustIcon iconId={card.iconId} />
              </div>
              <h3 className="trust__card-title">{card.title}</h3>
              <p className="trust__card-text">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
