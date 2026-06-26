import type { Category, ProductWithCategory } from "@/types/db";
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  productImagePaths,
} from "@/lib/seed-catalog";

/**
 * Static fallback when Supabase is not configured. Mirrors `src/lib/seed-catalog.ts`
 * and `npm run seed` output in `public/products/`.
 */

export const FALLBACK_CATEGORIES: Category[] = SEED_CATEGORIES.map((cat) => ({
  id: `cat-${cat.slug}`,
  name: cat.name,
  slug: cat.slug,
  description: cat.description,
  sort_order: cat.sort_order,
  created_at: new Date(0).toISOString(),
}));

function categoryRef(slug: string) {
  const found = FALLBACK_CATEGORIES.find((c) => c.slug === slug);
  return found ? { id: found.id, name: found.name, slug: found.slug } : null;
}

export const FALLBACK_PRODUCTS: ProductWithCategory[] = SEED_PRODUCTS.map(
  (p) => ({
    id: `prod-${p.slug}`,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    stock: p.stock,
    images: productImagePaths(p.slug, p.imageSources.length),
    features: p.features,
    badge: p.badge ?? null,
    badge_variant: p.badge_variant,
    category_id: `cat-${p.categorySlug}`,
    is_active: true,
    is_featured: p.is_featured,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
    category: categoryRef(p.categorySlug),
  }),
);
