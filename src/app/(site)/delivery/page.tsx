import type { Metadata } from "next";
import Link from "next/link";
import { PAYMENT_OPTIONS, SHIPPING_NOTE } from "@/constants/payment";
import InfoArticle from "@/components/content/InfoArticle";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getWebPageSchema } from "@/lib/structured-data";
import { typeCardTitle } from "@/lib/classes";

const TITLE = "Delivery and Payment";
const DESCRIPTION =
  "Bayt Al Hijama Equipment delivers across Pakistan. Shipping is confirmed after the order. Pay by cash on delivery, bank transfer, JazzCash, or Easypaisa.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/delivery" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/delivery",
  },
};

export default function DeliveryPage() {
  return (
    <>
      <InfoArticle eyebrow="Orders" title={TITLE} description={DESCRIPTION}>
        <section>
          <h2 className={`mb-2 text-white ${typeCardTitle}`}>
            Delivery across Pakistan
          </h2>
          <p>
            Orders ship from Lahore to cities and towns across Pakistan.{" "}
            {SHIPPING_NOTE} The product price in the shop does not include
            that shipping charge.
          </p>
        </section>

        <section>
          <h2 className={`mb-2 text-white ${typeCardTitle}`}>How to order</h2>
          <p>
            Choose items in the{" "}
            <Link href="/shop" className="text-gold hover:text-gold-light">
              shop
            </Link>
            , review the cart, and complete checkout with your name, phone,
            city, and address. You can also place the same order on WhatsApp if
            you want help choosing sizes before you pay.
          </p>
        </section>

        <section>
          <h2 className={`mb-3 text-white ${typeCardTitle}`}>Payment</h2>
          <ul className="space-y-3">
            {PAYMENT_OPTIONS.map((option) => (
              <li key={option.id}>
                <p className="text-white">{option.label}</p>
                <p className="text-white/70">{option.description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Bank, JazzCash, and Easypaisa account details are shown at checkout
            so you can send the receipt with your order number.
          </p>
        </section>
      </InfoArticle>
      <JsonLd
        data={[
          getWebPageSchema({
            path: "/delivery",
            name: TITLE,
            description: DESCRIPTION,
          }),
          getBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Delivery and Payment", path: "/delivery" },
          ]),
        ]}
      />
    </>
  );
}
