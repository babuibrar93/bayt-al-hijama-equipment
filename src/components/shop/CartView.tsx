"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils";
import { btnPrimary, cn } from "@/lib/classes";
import ProductImage from "@/components/shop/ProductImage";
import {
  SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
} from "@/constants/payment";

export default function CartView() {
  const { items, subtotal, updateQuantity, removeItem, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="py-20 text-center text-white/50">Loading cart...</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-glass-border bg-glass-bg px-6 py-20 text-center">
        <ShoppingBag className="mb-5 h-12 w-12 text-white/30" aria-hidden="true" />
        <h2 className="mb-2 font-body text-2xl text-white">
          Your cart is empty
        </h2>
        <p className="mb-8 max-w-sm text-white/60">
          Browse our premium Hijama equipment and add items to your cart.
        </p>
        <Link href="/shop" className={btnPrimary}>
          Continue Shopping
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <ul className="flex flex-col gap-4" role="list">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex gap-4 rounded-lg border border-glass-border bg-glass-bg p-4"
          >
            <Link
              href={`/shop/${item.slug}`}
              className="w-24 shrink-0 overflow-hidden rounded-sm sm:w-28"
            >
              <ProductImage src={item.image} alt={item.name} sizes="112px" />
            </Link>

            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/shop/${item.slug}`}
                  className="font-body text-lg leading-snug text-white transition-colors hover:text-gold"
                >
                  {item.name}
                </Link>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  aria-label={`Remove ${item.name} from cart`}
                  className="text-white/40 transition-colors hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <span className="mt-1 text-sm text-white/50">
                {formatPrice(item.price)} each
              </span>

              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="inline-flex items-center rounded-sm border border-glass-border">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-gold"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={item.quantity >= item.maxStock}
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="font-body text-lg font-semibold text-white">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-lg border border-glass-border bg-glass-bg p-6 lg:sticky lg:top-24">
        <h2 className="mb-5 font-body text-xl text-white">Order Summary</h2>
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between text-white/70">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-white/70">
            <dt>Shipping</dt>
            <dd>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</dd>
          </div>
          {shippingFee > 0 && (
            <p className="text-xs text-white/40">
              Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
            </p>
          )}
          <div className="mt-2 flex justify-between border-t border-glass-border pt-4 text-base font-semibold text-white">
            <dt>Total</dt>
            <dd className="font-body text-xl">{formatPrice(total)}</dd>
          </div>
        </dl>

        <Link
          href="/checkout"
          className={cn(btnPrimary, "mt-6 w-full justify-center")}
        >
          Proceed to Checkout
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="/shop"
          className="mt-3 block text-center text-sm text-white/50 transition-colors hover:text-white"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
