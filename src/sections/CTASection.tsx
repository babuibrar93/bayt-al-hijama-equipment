import Particles from "@/components/ui/Particles";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { CTA_TRUST_ITEMS } from "@/constants/footer";
import { SITE } from "@/constants/site";
import { WHATSAPP } from "@/constants/whatsapp";
import {
  btnLarge,
  btnPrimary,
  container,
  getRevealClass,
  section,
} from "@/lib/classes";

export default function CTASection() {
  return (
    <section
      data-section
      className={`${section} overflow-hidden`}
      id="contact"
      aria-label="Call to action"
    >
      <div className="pointer-events-none absolute inset-0 bg-cta-bg bg-black" aria-hidden="true" />
      <Particles id="ctaParticles" options={{ count: 20, goldRatio: 0.5, minDur: 5, maxDur: 12 }} />

      <div className={container}>
        <div
          data-reveal
          className={`relative z-[2] mx-auto max-w-[680px] text-center ${getRevealClass("up")}`}
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-mid/30 bg-green-mid/15 px-5 py-2 text-[0.78rem] font-semibold tracking-[0.08em] text-green-light">
            📦 Ships All Across Pakistan
          </div>
          <h2 className="mb-6 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.1] text-white [&_em]:italic [&_em]:text-gold">
            Ready to Upgrade
            <br />
            <em>Your Practice?</em>
          </h2>
          <p className="mb-9 text-[1.05rem] leading-[1.75] text-white/60">
            Message us on WhatsApp and get personalised product recommendations,
            bulk pricing, and delivery details — all in minutes.
          </p>

          <div className="mb-10 inline-flex items-center gap-2.5 text-[0.82rem] text-green-light">
            <span className="h-2 w-2 animate-urgency-pulse rounded-full bg-green-light" aria-hidden="true" />
            Our team is online right now and ready to help
          </div>

          <div className="mb-10 flex flex-col items-center gap-5">
            <a
              href={WHATSAPP.cta}
              data-magnetic
              className={`${btnPrimary} ${btnLarge}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="flex shrink-0">
                <WhatsAppIcon size={20} />
              </span>
              Chat on WhatsApp Now
            </a>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[0.8rem] text-white/50">Or call / WhatsApp directly:</span>
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="font-body text-[1.6rem] font-semibold tabular-nums tracking-[0.08em] text-gold transition-colors hover:text-gold-light"
              >
                {SITE.phone}
              </a>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-[0.78rem] text-white/50">
            {CTA_TRUST_ITEMS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
