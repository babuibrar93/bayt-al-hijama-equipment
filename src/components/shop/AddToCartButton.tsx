"use client";

import { useState } from "react";
import { ShoppingBag, Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart, type CartItem } from "@/context/CartContext";
import { cn, btnPrimary } from "@/lib/classes";

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity">;
  /** Show a quantity stepper (used on product detail pages). */
  withQuantity?: boolean;
  className?: string;
}

export default function AddToCartButton({
  product,
  withQuantity = false,
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const outOfStock = product.maxStock <= 0;

  const handleAdd = () => {
    if (outOfStock) return;
    addItem(product, quantity);
    setAdded(true);
    toast.success(`${product.name} added to cart`);
    window.setTimeout(() => setAdded(false), 1600);
  };

  if (outOfStock) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-sm border border-glass-border px-7 py-3.5 text-[0.88rem] font-semibold text-white/40",
          className,
        )}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", withQuantity && "sm:flex-row sm:items-center")}>
      {withQuantity && (
        <div className="inline-flex items-center rounded-sm border border-glass-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-12 w-12 items-center justify-center text-white/70 transition-colors hover:text-gold"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-base font-semibold text-white" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() =>
              setQuantity((q) => Math.min(product.maxStock, q + 1))
            }
            className="flex h-12 w-12 items-center justify-center text-white/70 transition-colors hover:text-gold"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${product.name} to cart`}
        className={cn(btnPrimary, "justify-center", withQuantity && "sm:flex-1", className)}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" aria-hidden="true" />
            Added
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
