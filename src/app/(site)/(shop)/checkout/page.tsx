import type { Metadata } from "next";
import CheckoutView from "@/components/shop/CheckoutView";
import PageHeader from "@/components/shop/PageHeader";
import { pageInner, pageShell } from "@/lib/classes";

export const metadata: Metadata = {
  title: "Checkout",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className={pageShell}>
      <div className={pageInner}>
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout" },
          ]}
          eyebrow="Secure Checkout"
          description="Enter shipping details and choose your payment method. We'll confirm your order shortly."
        />
        <CheckoutView />
      </div>
    </div>
  );
}
