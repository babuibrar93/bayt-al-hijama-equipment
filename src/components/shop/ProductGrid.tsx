import ProductCard from "@/components/shop/ProductCard";
import { cn, productGrid } from "@/lib/classes";
import type { ProductWithCategory } from "@/types/db";

interface ProductGridProps {
  products: ProductWithCategory[];
  view?: "grid" | "list";
  /** How many leading cards get priority image loading. */
  priorityCount?: number;
  className?: string;
}

/** Shared shop/landing product grid — same card + 4-up layout everywhere. */
export default function ProductGrid({
  products,
  view = "grid",
  priorityCount = 0,
  className,
}: ProductGridProps) {
  if (view === "list") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < priorityCount}
            view="list"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn(productGrid, className)}>
      {products.map((product, index) => (
        <div key={product.id} className="h-full">
          <ProductCard
            product={product}
            priority={index < priorityCount}
            view="grid"
          />
        </div>
      ))}
    </div>
  );
}
