import type { Metadata } from "next";
import CartView from "@/components/shop/CartView";
import Breadcrumbs from "@/components/shop/Breadcrumbs";

export const metadata: Metadata = {
  title: "Your Cart",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="px-6 pb-24 pt-nav">
      <div className="mx-auto w-full max-w-container pt-12">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        <h1 className="mb-10 font-body text-[clamp(2rem,4vw,3rem)] font-normal text-white">
          Your Cart
        </h1>
        <CartView />
      </div>
    </div>
  );
}
