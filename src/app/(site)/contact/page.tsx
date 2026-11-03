import type { Metadata } from "next";
import { FOOTER_SOCIAL } from "@/constants/footer";
import { SITE } from "@/constants/site";
import { WHATSAPP } from "@/constants/whatsapp";
import InfoArticle from "@/components/content/InfoArticle";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getWebPageSchema } from "@/lib/structured-data";
import { typeCardTitle } from "@/lib/classes";

const TITLE = "Contact Bayt Al Hijama Equipment";
const DESCRIPTION =
  "Contact Bayt Al Hijama Equipment in Lahore on WhatsApp, phone, or email for Hijama cups, pumps, kits, and clinic supplies delivered across Pakistan.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <InfoArticle eyebrow="Contact" title={TITLE} description={DESCRIPTION}>
        <section>
          <h2 className={`mb-2 text-white ${typeCardTitle}`}>Talk to the shop</h2>
          <ul className="space-y-2">
            <li>
              Phone:{" "}
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="text-gold hover:text-gold-light"
              >
                {SITE.phone}
              </a>
            </li>
            <li>
              WhatsApp:{" "}
              <a
                href={WHATSAPP.mobile}
                className="text-gold hover:text-gold-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                {SITE.phone}
              </a>
            </li>
            <li>
              Email:{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="text-gold hover:text-gold-light"
              >
                {SITE.email}
              </a>
            </li>
            <li>Location: {SITE.location}. Delivery: {SITE.delivery}.</li>
          </ul>
        </section>

        <section>
          <h2 className={`mb-2 text-white ${typeCardTitle}`}>Social</h2>
          <ul className="space-y-2">
            {FOOTER_SOCIAL.filter((item) => item.label !== "WhatsApp").map(
              (item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-gold hover:text-gold-light"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </section>
      </InfoArticle>
      <JsonLd
        data={[
          getWebPageSchema({
            path: "/contact",
            name: TITLE,
            description: DESCRIPTION,
            type: "ContactPage",
          }),
          getBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
    </>
  );
}
