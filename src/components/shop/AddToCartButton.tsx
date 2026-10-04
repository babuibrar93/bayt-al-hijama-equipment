"use client";

import { useState } from "react";
import { ShoppingBag, Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart, type CartItem } from "@/context/CartContext";
import { cn, btnPrimary, typeBody, typeBtn } from "@/lib/classes";

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
  const [qtyDraft, setQtyDraft] = useState("1");
  const [added, setAdded] = useState(false);

  const outOfStock = product.maxStock <= 0;
  const maxStock = Math.max(1, product.maxStock);

  const clampQty = (value: number) =>
    Math.min(maxStock, Math.max(1, Math.floor(value)));

  const setQty = (value: number) => {
    const next = clampQty(value);
    setQuantity(next);
    setQtyDraft(String(next));
  };

  const handleAdd = () => {
    if (outOfStock) return;
    const qty = clampQty(quantity);
    addItem(product, qty);
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
          "inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-sm border border-glass-border px-7 py-3.5 font-semibold text-white/40",
          withQuantity ? "w-auto" : "w-full",
          typeBtn,
          className,
        )}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        withQuantity && "sm:flex-row sm:items-center",
      )}
    >
      {withQuantity && (
        <div className="inline-flex items-center rounded-sm border border-glass-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty(quantity - 1)}
            className="flex h-12 w-12 items-center justify-center text-white/70 transition-colors hover:text-gold"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            aria-label="Quantity"
            value={qtyDraft}
            onChange={(event) => {
              const raw = event.target.value.replace(/\D/g, "");
              setQtyDraft(raw);
              if (!raw) return;
              const parsed = Number(raw);
              if (Number.isFinite(parsed)) {
                setQuantity(clampQty(parsed));
              }
            }}
            onBlur={() => {
              setQty(quantity || 1);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
            className={cn(
              "h-12 w-14 border-x border-glass-border bg-transparent text-center font-semibold text-white outline-none focus:bg-white/5",
              typeBody,
            )}
          />
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty(quantity + 1)}
            className="flex h-12 w-12 items-center justify-center text-white/70 transition-colors hover:text-gold"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add to Cart: ${product.name}`}
        className={cn(
          btnPrimary,
          "justify-center",
          withQuantity ? "w-auto self-start px-8 sm:px-10" : undefined,
          className,
        )}
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
