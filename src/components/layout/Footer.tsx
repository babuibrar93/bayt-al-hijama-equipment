import Logo from "@/components/ui/Logo";
import ArabicName from "@/components/layout/ArabicName";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { FacebookIcon, InstagramIcon } from "@/components/icons/BrandIcons";
import { SITE } from "@/constants/site";
import {
  FOOTER_CONTACT,
  FOOTER_PRODUCT_LINKS,
  FOOTER_PROFESSIONAL_LINKS,
  FOOTER_SOCIAL,
} from "@/constants/footer";
import { container } from "@/lib/classes";

const SOCIAL_ICON_SIZE = 20;

const socialIconClass =
  "flex h-10 w-10 items-center justify-center rounded-full bg-gold text-black transition-colors duration-[250ms] hover:bg-gold-light";

export default function Footer() {
  return (
    <footer
      className="border-t border-glass-border bg-black-3"
      role="contentinfo"
    >
      <div className="py-10 pb-8">
        <div
          className={`${container} grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] lg:gap-10 sm:max-lg:[&_.footer-brand]:col-span-2`}
        >
          <div className="footer-brand">
            <Logo size="md" href="/" className="mb-3" />
            <p className="mb-4 max-w-[280px] text-[0.85rem] leading-[1.65] text-white/60">
              Pakistan&apos;s most trusted professional Hijama equipment
              supplier. Serving therapists, clinics, and institutes across the
              nation.
            </p>
            <div className="flex gap-2" aria-label="Social media links">
              {FOOTER_SOCIAL.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIconClass}
                  aria-label={item.label}
                >
                  {item.label === "Facebook" ? (
                    <FacebookIcon size={SOCIAL_ICON_SIZE} />
                  ) : item.label === "Instagram" ? (
                    <InstagramIcon size={SOCIAL_ICON_SIZE} />
                  ) : (
                    <WhatsAppIcon size={SOCIAL_ICON_SIZE} />
                  )}
                </a>
              ))}
            </div>
          </div>

          {[FOOTER_PRODUCT_LINKS, FOOTER_PROFESSIONAL_LINKS].map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-white">
                {group.title}
              </p>
              <ul className="flex flex-col gap-2.5" role="list">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.85rem] text-white/60 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-white">
              Contact
            </p>
            <ul className="flex flex-col gap-2.5" role="list">
              <li className="flex items-center gap-2.5 text-[0.85rem] text-white/60">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a
                  href={FOOTER_CONTACT.phoneHref}
                  className="transition-colors hover:text-gold"
                >
                  {FOOTER_CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-[0.85rem] text-white/60">
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
              <li className="flex items-center gap-2.5 text-[0.85rem] text-white/60">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{FOOTER_CONTACT.location}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-glass-border py-4">
        <div
          className={`${container} flex flex-col items-center justify-between gap-2 sm:flex-row`}
        >
          <p className="text-[0.78rem] text-white/50">{SITE.copyright}</p>
          <ArabicName>{SITE.arabicName}</ArabicName>
        </div>
      </div>
    </footer>
  );
}
