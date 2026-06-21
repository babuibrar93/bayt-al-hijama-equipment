import Particles from "@/components/ui/Particles";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { CTA_TRUST_ITEMS } from "@/constants/footer";
import { SITE } from "@/constants/site";
import { WHATSAPP } from "@/constants/whatsapp";

export default function CTASection() {
  return (
    <section className="cta-section section" id="contact" aria-label="Call to action">
      <div className="cta-section__bg" aria-hidden="true" />
      <Particles
        id="ctaParticles"
        options={{ count: 20, goldRatio: 0.5, minDur: 5, maxDur: 12 }}
      />

      <div className="container">
        <div className="cta-section__inner reveal-up">
          <div className="cta-section__badge">📦 Ships All Across Pakistan</div>
          <h2 className="cta-section__title">
            Ready to Upgrade
            <br />
            <em>Your Practice?</em>
          </h2>
          <p className="cta-section__sub">
            Message us on WhatsApp and get personalised product recommendations,
            bulk pricing, and delivery details — all in minutes.
          </p>

          <div className="cta-section__urgency">
            <span className="cta-section__urgency-dot" aria-hidden="true" />
            Our team is online right now and ready to help
          </div>

          <div className="cta-section__actions">
            <a
              href={WHATSAPP.cta}
              className="btn btn--primary btn--large"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="btn__icon">
                <WhatsAppIcon size={20} />
              </span>
              Chat on WhatsApp Now
            </a>
            <div className="cta-section__contact">
              <span>Or call / WhatsApp directly:</span>
              <a href={`tel:${SITE.phoneRaw}`} className="cta-section__phone">
                {SITE.phone}
              </a>
            </div>
          </div>

          <div className="cta-section__trust">
            {CTA_TRUST_ITEMS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
