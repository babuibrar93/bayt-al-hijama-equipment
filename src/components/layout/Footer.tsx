import { SITE } from "@/constants/site";
import {
  FOOTER_CONTACT,
  FOOTER_PRODUCT_LINKS,
  FOOTER_PROFESSIONAL_LINKS,
} from "@/constants/footer";
import { WHATSAPP } from "@/constants/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__top">
        <div className="container footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-icon" aria-hidden="true">
                ⬡
              </span>
              <div>
                <span className="footer__logo-name">{SITE.shortName}</span>
                <span className="footer__logo-tagline">{SITE.tagline}</span>
              </div>
            </div>
            <p className="footer__brand-desc">
              Pakistan&apos;s most trusted professional Hijama equipment supplier.
              Serving therapists, clinics, and institutes across the nation.
            </p>
            <div className="footer__social" aria-label="Social media links">
              <a
                href={WHATSAPP.mobile}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={18} />
              </a>
            </div>
          </div>

          {[FOOTER_PRODUCT_LINKS, FOOTER_PROFESSIONAL_LINKS].map((group) => (
            <div className="footer__col" key={group.title}>
              <h4 className="footer__col-title">{group.title}</h4>
              <ul className="footer__links" role="list">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <ul className="footer__contact-list" role="list">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" aria-hidden="true">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={FOOTER_CONTACT.phoneHref}>{FOOTER_CONTACT.phone}</a>
              </li>
              <li>
                <WhatsAppIcon size={16} />
                <a href={FOOTER_CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
                  WhatsApp Order
                </a>
              </li>
              <li>
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

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>{SITE.copyright}</p>
          <p className="footer__arabic" lang="ar" dir="rtl">
            {SITE.arabicName}
          </p>
        </div>
      </div>
    </footer>
  );
}
