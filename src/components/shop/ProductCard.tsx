import Link from "next/link";
import ProductImage from "@/components/shop/ProductImage";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { cn, getBadgeClass, numeric, productBadgeScrim } from "@/lib/classes";
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
        isList ? "flex-col sm:flex-row" : "flex-col hover:-translate-y-1",
      )}
    >
      <Link
        href={`/shop/${product.slug}`}
        className={cn(
          "relative block shrink-0",
          isList ? "w-full sm:w-36 md:w-44" : "w-full",
        )}
        aria-label={`View ${product.name}`}
      >
        {product.badge && (
          <>
            <span className={productBadgeScrim} aria-hidden="true" />
            <span className={getBadgeClass(product.badge_variant)}>
              {product.badge}
            </span>
          </>
        )}
        <ProductImage
          src={image}
          alt={product.name}
          priority={priority}
          sizes={
            isList
              ? "(max-width: 639px) 100vw, 176px"
              : "(max-width: 519px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
        />
      </Link>

      <div className={cn("flex min-w-0 flex-1 flex-col p-4 sm:p-5")}>
        {product.category && (
          <span className="mb-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gold/80 sm:text-[0.65rem] sm:tracking-[0.16em]">
            {product.category.name}
          </span>
        )}
        <h3 className="mb-1.5 min-w-0 font-body text-[0.9375rem] font-medium leading-snug text-white sm:text-base md:text-lg">
          <Link
            href={`/shop/${product.slug}`}
            className="transition-colors hover:text-gold"
          >
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-[0.8125rem] text-white/55 sm:text-sm">
          {product.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className={cn("text-base font-semibold text-white sm:text-lg md:text-xl", numeric)}>
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
            className="w-full px-3 py-2 text-[0.78rem] sm:px-4 sm:py-2.5 sm:text-[0.82rem]"
          />
        </div>
      </div>
    </article>
  );
}
