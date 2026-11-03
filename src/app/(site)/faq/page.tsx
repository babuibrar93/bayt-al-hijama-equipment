import type { Metadata } from "next";
import Link from "next/link";
import { FAQ_ITEMS } from "@/constants/testimonials";
import InfoArticle from "@/components/content/InfoArticle";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getFaqSchema } from "@/lib/structured-data";
import { typeCardTitle } from "@/lib/classes";

const TITLE = "Hijama Equipment FAQ";
const DESCRIPTION =
  "Answers about ordering Hijama equipment from Bayt Al Hijama, delivery across Pakistan, shipping charges, and payment by cash on delivery, bank transfer, JazzCash, or Easypaisa.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/faq" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/faq",
  },
};

export default function FaqPage() {
  return (
    <>
      <InfoArticle
        eyebrow="FAQ"
        title={TITLE}
        description={DESCRIPTION}
      >
        <div className="space-y-6">
          {FAQ_ITEMS.map((item) => (
            <section key={item.question}>
              <h2 className={`mb-2 text-white ${typeCardTitle}`}>
                {item.question}
              </h2>
              <p>{item.answer}</p>
            </section>
          ))}
        </div>
        <p>
          Still deciding? Browse the{" "}
          <Link href="/shop" className="text-gold hover:text-gold-light">
            shop
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="text-gold hover:text-gold-light">
            contact the team
          </Link>
          .
        </p>
      </InfoArticle>
      <JsonLd
        data={[
          getFaqSchema("/faq"),
          getBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ]}
      />
    </>
  );
}
