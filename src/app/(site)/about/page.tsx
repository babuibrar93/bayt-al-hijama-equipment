import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/constants/site";
import InfoArticle from "@/components/content/InfoArticle";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getWebPageSchema } from "@/lib/structured-data";
import { typeCardTitle } from "@/lib/classes";

const TITLE = "About Bayt Al Hijama Equipment";
const DESCRIPTION =
  "Bayt Al Hijama Equipment supplies Hijama cups, pumps, and clinic consumables from Lahore to therapists, clinics, institutes, and students across Pakistan.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <InfoArticle eyebrow="Company" title={TITLE} description={DESCRIPTION}>
        <section>
          <h2 className={`mb-2 text-white ${typeCardTitle}`}>What we sell</h2>
          <p>
            Bayt Al Hijama Equipment is a Hijama equipment supplier based in
            Lahore. The shop lists cups, vacuum pumps and machines, therapy
            tools, and clinic consumables, with prices in Pakistani rupees.
            Orders can be placed on this website or on WhatsApp at {SITE.phone}.
          </p>
        </section>

        <section id="therapists">
          <h2 className={`mb-2 text-white ${typeCardTitle}`}>
            Hijama therapists
          </h2>
          <p>
            Practising therapists use the shop for replacement cups, pumps, and
            day-to-day clinic supplies. Product pages show the price, stock, and
            a short description so you can order a specific item without waiting
            on a quote.
          </p>
        </section>

        <section id="clinics">
          <h2 className={`mb-2 text-white ${typeCardTitle}`}>Clinic owners</h2>
          <p>
            Clinics can stock cups, pumps, gloves, blades, masks, gowns, and
            other disposables from one supplier. Delivery covers cities and
            towns across Pakistan. Shipping is confirmed after the order, from
            the city and the items in the cart.
          </p>
        </section>

        <section id="institutes">
          <h2 className={`mb-2 text-white ${typeCardTitle}`}>
            Training institutes
          </h2>
          <p>
            Institutes that teach Hijama can order equipment and consumables
            for students. For a class set or a repeat order, message WhatsApp
            and ask for bulk pricing.
          </p>
        </section>

        <section id="students">
          <h2 className={`mb-2 text-white ${typeCardTitle}`}>Students</h2>
          <p>
            Students can buy individual tools and starter supplies from the{" "}
            <Link href="/shop" className="text-gold hover:text-gold-light">
              shop
            </Link>
            . There is no minimum order.
          </p>
        </section>

        <section id="wellness">
          <h2 className={`mb-2 text-white ${typeCardTitle}`}>
            Wellness centers
          </h2>
          <p>
            Wellness centers looking for cupping tools, massage cups, and
            related equipment can browse the{" "}
            <Link
              href="/shop/category/therapy-tools"
              className="text-gold hover:text-gold-light"
            >
              therapy tools
            </Link>{" "}
            and{" "}
            <Link
              href="/shop/category/hijama-cups"
              className="text-gold hover:text-gold-light"
            >
              Hijama cups
            </Link>{" "}
            categories.
          </p>
        </section>

        <p>
          Read{" "}
          <Link href="/delivery" className="text-gold hover:text-gold-light">
            delivery and payment
          </Link>
          , the{" "}
          <Link href="/faq" className="text-gold hover:text-gold-light">
            FAQ
          </Link>
          , or the{" "}
          <Link href="/contact" className="text-gold hover:text-gold-light">
            contact page
          </Link>{" "}
          for phone, email, and WhatsApp.
        </p>
      </InfoArticle>
      <JsonLd
        data={[
          getWebPageSchema({
            path: "/about",
            name: TITLE,
            description: DESCRIPTION,
            type: "AboutPage",
          }),
          getBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
    </>
  );
}
