import Link from "next/link";
import ProductImage from "@/components/shop/ProductImage";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { cn, getBadgeClass, numeric } from "@/lib/classes";
import { formatPrice } from "@/utils";
import type { ProductWithCategory } from "@/types/db";

interface ProductCardProps {
  product: ProductWithCategory;
  priority?: boolean;
  view?: "grid" | "list";
}

export default function ProductCard({
  product,
  priority,
  view = "grid",
}: ProductCardProps) {
  const image = product.images[0] ?? null;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock <= 0;
  const isList = view === "list";

  return (
    <article
      className={cn(
        "group flex overflow-hidden rounded-lg border border-glass-border bg-glass-bg transition-all duration-300 hover:border-gold/30",
        isList ? "flex-row" : "flex-col hover:-translate-y-1",
      )}
    >
      <Link
        href={`/shop/${product.slug}`}
        className={cn("relative block shrink-0", isList && "w-32 sm:w-44")}
        aria-label={`View ${product.name}`}
      >
        {product.badge && (
          <span className={getBadgeClass(product.badge_variant)}>
            {product.badge}
          </span>
        )}
        <ProductImage
          src={image}
          alt={product.name}
          priority={priority}
          sizes={
            isList
              ? "176px"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
        />
      </Link>

      <div className={cn("flex flex-1 flex-col", isList ? "p-4" : "p-4")}>
        {product.category && (
          <span className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold/80">
            {product.category.name}
          </span>
        )}
        <h3 className="mb-1.5 font-display text-base font-medium leading-snug text-white sm:text-lg">
          <Link
            href={`/shop/${product.slug}`}
            className="transition-colors hover:text-gold"
          >
            {product.name}
          </Link>
        </h3>
        <p
          className={cn(
            "text-sm text-white/55",
            isList ? "line-clamp-2" : "line-clamp-2",
          )}
        >
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className={cn("text-lg font-semibold text-white sm:text-xl", numeric)}>
            {formatPrice(product.price)}
          </span>
          {outOfStock ? (
            <span className="text-xs font-medium text-red-400">Out of stock</span>
          ) : lowStock ? (
            <span className="text-xs font-medium text-gold">
              Only {product.stock} left
            </span>
          ) : null}
        </div>

        <div className="mt-3.5">
          <AddToCartButton
            product={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image,
              maxStock: product.stock,
            }}
            className="w-full px-4 py-2.5 text-[0.82rem]"
          />
        </div>
      </div>
    </article>
  );
}
