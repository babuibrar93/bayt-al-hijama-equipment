import type { Metadata } from "next";
import CartView from "@/components/shop/CartView";
import PageHeader from "@/components/shop/PageHeader";
import { pageInner, pageShell } from "@/lib/classes";

export const metadata: Metadata = {
  title: "Your Cart",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className={pageShell}>
      <div className={pageInner}>
        <PageHeader
          crumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
          eyebrow="Shopping Cart"
          description="Review your items, adjust quantities, and proceed when you're ready to checkout."
        />
        <CartView />
      </div>
    </div>
  );
}
