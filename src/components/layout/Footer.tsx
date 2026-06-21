import { SITE } from "@/constants/site";
import {
  FOOTER_CONTACT,
  FOOTER_PRODUCT_LINKS,
  FOOTER_PROFESSIONAL_LINKS,
} from "@/constants/footer";
import { WHATSAPP } from "@/constants/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { container } from "@/lib/classes";

export default function Footer() {
  return (
    <footer className="border-t border-glass-border bg-black-3" role="contentinfo">
      <div className="py-20 pb-[60px]">
        <div
          className={`${container} grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] lg:gap-12 max-lg:[&_.footer-brand]:col-span-2`}
        >
          <div className="footer-brand">
            <div className="mb-5 flex items-center gap-3">
              <span className="text-[2rem] text-gold" aria-hidden="true">
                ⬡
              </span>
              <div>
                <span className="block font-display text-[1.2rem] font-semibold text-white">
                  {SITE.shortName}
                </span>
                <span className="block text-[0.7rem] uppercase tracking-[0.15em] text-gold">
                  {SITE.tagline}
                </span>
              </div>
            </div>
            <p className="mb-7 max-w-[280px] text-[0.87rem] leading-[1.75] text-white/60">
              Pakistan&apos;s most trusted professional Hijama equipment supplier.
              Serving therapists, clinics, and institutes across the nation.
            </p>
            <div className="flex gap-3" aria-label="Social media links">
              <a
                href={WHATSAPP.mobile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-glass-border bg-glass-bg text-white/60 transition-all duration-[250ms] hover:border-green-mid hover:bg-green-mid hover:text-white"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={18} />
              </a>
            </div>
          </div>

          {[FOOTER_PRODUCT_LINKS, FOOTER_PROFESSIONAL_LINKS].map((group) => (
            <div key={group.title}>
              <h4 className="mb-5 text-[0.72rem] font-bold uppercase tracking-[0.15em] text-white">
                {group.title}
              </h4>
              <ul className="flex flex-col gap-3" role="list">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.87rem] text-white/60 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-5 text-[0.72rem] font-bold uppercase tracking-[0.15em] text-white">
              Contact
            </h4>
            <ul className="flex flex-col gap-3.5" role="list">
              <li className="flex items-center gap-2.5 text-[0.87rem] text-white/60">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" aria-hidden="true">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={FOOTER_CONTACT.phoneHref} className="transition-colors hover:text-gold">
                  {FOOTER_CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-[0.87rem] text-white/60">
                <WhatsAppIcon size={16} />
                <a
                  href={FOOTER_CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold"
                >
                  WhatsApp Order
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-[0.87rem] text-white/60">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" aria-hidden="true">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{FOOTER_CONTACT.location}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-glass-border py-7">
        <div className={`${container} flex flex-col items-center justify-between gap-3 sm:flex-row`}>
          <p className="text-[0.8rem] text-white/50">{SITE.copyright}</p>
          <p className="font-urdu text-[1.2rem] text-gold/70" lang="ar" dir="rtl">
            {SITE.arabicName}
          </p>
        </div>
      </div>
    </footer>
  );
}
