import Link from "next/link";
import ProductImage from "@/components/shop/ProductImage";
import AddToCartButton from "@/components/shop/AddToCartButton";
import {
  cn,
  numeric,
  typeBodySm,
  typeBtnSm,
  typeCardTitle,
  typeEyebrow,
  typeMeta,
} from "@/lib/classes";
import { formatPrice } from "@/utils";
import type { ProductWithCategory } from "@/types/db";

interface ProductCardProps {
  product: ProductWithCategory;
  priority?: boolean;
  view?: "grid" | "list";
}

/** Shared product card used on landing, shop, and product detail. */
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
        "group flex h-full overflow-hidden rounded-lg border border-glass-border bg-glass-bg transition-all duration-300 hover:border-gold/30",
        isList ? "flex-col sm:flex-row" : "flex-col hover:-translate-y-1",
      )}
    >
      <Link
        href={`/shop/${product.slug}`}
        prefetch={false}
        className={cn(
          "relative block shrink-0",
          isList ? "w-full sm:w-36 md:w-44" : "w-full",
        )}
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          src={image}
          alt={product.name}
          priority={priority}
          className={isList ? undefined : "aspect-[5/4]"}
          sizes={
            isList
              ? "(max-width: 639px) 100vw, 176px"
              : "(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
          }
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-3.5">
        {product.category && (
          <span
            className={cn(
              "mb-0.5 font-semibold uppercase tracking-[0.14em] text-gold/80",
              typeEyebrow,
            )}
          >
            {product.category.name}
          </span>
        )}
        <h3
          className={cn(
            "line-clamp-2 min-w-0 font-body font-medium leading-snug text-white",
            typeCardTitle,
          )}
        >
          <Link
            href={`/shop/${product.slug}`}
            prefetch={false}
            className="transition-colors hover:text-gold"
          >
            {product.name}
          </Link>
        </h3>
        <p
          className={cn(
            "mt-0.5 line-clamp-2 min-h-[2.5em] leading-snug text-white/55",
            typeBodySm,
          )}
        >
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
            <span
              className={cn("font-semibold text-white", numeric, typeCardTitle)}
            >
              {formatPrice(product.price)}
            </span>
            {outOfStock ? (
              <span className={cn("font-medium text-red-400", typeMeta)}>
                Out of stock
              </span>
            ) : lowStock ? (
              <span className={cn("font-medium text-gold", typeMeta)}>
                Only {product.stock} left
              </span>
            ) : null}
          </div>

          <div className="mt-2.5">
            <AddToCartButton
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image,
                maxStock: product.stock,
              }}
              className={cn("min-h-12 w-full px-3 py-2.5", typeBtnSm)}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
