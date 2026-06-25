import type { Metadata } from "next";
import CheckoutView from "@/components/shop/CheckoutView";
import Breadcrumbs from "@/components/shop/Breadcrumbs";

export const metadata: Metadata = {
  title: "Checkout",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="px-6 pb-24 pt-nav">
      <div className="mx-auto w-full max-w-container pt-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout" },
          ]}
        />
        <h1 className="mb-10 font-body text-[clamp(2rem,4vw,3rem)] font-normal text-white">
          Checkout
        </h1>
        <CheckoutView />
      </div>
    </div>
  );
}
