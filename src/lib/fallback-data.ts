import type { Category, ProductWithCategory } from "@/types/db";

/**
 * Static fallback used when Supabase is not yet configured, so the shop and
 * landing page still render during local setup. Mirrors `supabase/seed.sql`.
 */
export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "cat-cups",
    name: "Hijama Cups",
    slug: "hijama-cups",
    description:
      "Glass, silicone, and plastic cups in all sizes for wet, dry, and massage cupping.",
    sort_order: 1,
    created_at: new Date(0).toISOString(),
  },
  {
    id: "cat-kits",
    name: "Complete Kits",
    slug: "complete-kits",
    description: "All-in-one kits for therapists and clinics. Ready to practise.",
    sort_order: 2,
    created_at: new Date(0).toISOString(),
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Vacuum pumps, gauges, tubing, and storage cases.",
    sort_order: 3,
    created_at: new Date(0).toISOString(),
  },
  {
    id: "cat-consumables",
    name: "Consumables",
    slug: "consumables",
    description:
      "Sterile lancets, disposable blades, gloves, and antiseptics in bulk.",
    sort_order: 4,
    created_at: new Date(0).toISOString(),
  },
];

function category(slug: string) {
  const found = FALLBACK_CATEGORIES.find((c) => c.slug === slug);
  return found ? { id: found.id, name: found.name, slug: found.slug } : null;
}

export const FALLBACK_PRODUCTS: ProductWithCategory[] = [
  {
    id: "prod-vacuum-kit",
    name: "Vacuum Pump Hijama Kit",
    slug: "vacuum-pump-hijama-kit",
    description:
      "Complete professional set with 12 cups, precision pistol pump, and storage case. The therapist's first choice for controlled suction.",
    price: 8500,
    stock: 25,
    images: [],
    features: [
      "12 graduated cup sizes",
      "Precision vacuum pistol",
      "Release valve system",
      "Carry case included",
    ],
    badge: "Best Seller",
    badge_variant: "default",
    category_id: "cat-kits",
    is_active: true,
    is_featured: true,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
    category: category("complete-kits"),
  },
  {
    id: "prod-silicone-set",
    name: "Premium Silicone Cup Set",
    slug: "premium-silicone-cup-set",
    description:
      "Flexible medical-grade silicone cups in multiple sizes. Perfect for dry cupping, massage cupping, and moving cupping techniques.",
    price: 3200,
    stock: 40,
    images: [],
    features: [
      "Medical-grade silicone",
      "6 sizes in one set",
      "Easy squeeze mechanism",
      "Autoclave-safe",
    ],
    badge: "Popular",
    badge_variant: "new",
    category_id: "cat-cups",
    is_active: true,
    is_featured: true,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
    category: category("hijama-cups"),
  },
  {
    id: "prod-clinic-kit",
    name: "Complete Clinic Starter Kit",
    slug: "complete-clinic-starter-kit",
    description:
      "Everything a new clinic needs: cups, pump, lancets, disposable blades, gloves, and practitioner guide. Start practising from day one.",
    price: 15500,
    stock: 15,
    images: [],
    features: [
      "Full equipment set",
      "Consumables included",
      "Instructional guide",
      "Storage & carry bag",
    ],
    badge: "Clinic Kit",
    badge_variant: "gold",
    category_id: "cat-kits",
    is_active: true,
    is_featured: true,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
    category: category("complete-kits"),
  },
];
