import type { Metadata } from "next";
import { Suspense } from "react";
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
          description="Enter shipping details and choose payment. For bank / JazzCash / Easypaisa you'll see payment details before the order is placed."
        />
        <Suspense
          fallback={
            <div className="py-20 text-center text-white/50">Loading...</div>
          }
        >
          <CheckoutView />
        </Suspense>
      </div>
    </div>
  );
}
