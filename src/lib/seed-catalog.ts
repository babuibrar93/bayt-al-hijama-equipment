/**
 * Single source of truth for shop seed data.
 * Used by `npm run seed` and static fallback when Supabase is not configured.
 *
 * Product photos: Pexels / Unsplash (free for commercial use). Downloaded locally
 * by `npm run seed` — not hotlinked in production.
 */

/** Pexels CDN — stable direct download URLs for the seeder */
export function pexelsPhoto(id: number): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=960`;
}

export function unsplashPhoto(id: string): string {
  return `https://images.unsplash.com/photo-${id}?w=960&q=80&auto=format&fit=crop`;
}

export interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  sort_order: number;
}

export interface SeedProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  features: string[];
  badge?: string;
  badge_variant: "default" | "new" | "gold";
  categorySlug: string;
  is_featured: boolean;
  /** Remote URLs downloaded into `public/products/{slug}-{n}.jpg` by the seeder */
  imageSources: string[];
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    name: "Hijama Cups",
    slug: "hijama-cups",
    description:
      "Glass, silicone, and polycarbonate cups in all sizes for wet, dry, and massage cupping.",
    sort_order: 1,
  },
  {
    name: "Complete Kits",
    slug: "complete-kits",
    description:
      "All-in-one kits for therapists, clinics, and students — ready to practise.",
    sort_order: 2,
  },
  {
    name: "Accessories",
    slug: "accessories",
    description:
      "Vacuum pumps, extension tubes, valves, gauges, and professional carry cases.",
    sort_order: 3,
  },
  {
    name: "Consumables",
    slug: "consumables",
    description:
      "Sterile lancets, disposable blades, gloves, and antiseptics in clinic-friendly packs.",
    sort_order: 4,
  },
];

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: "Vacuum Pump Hijama Kit",
    slug: "vacuum-pump-hijama-kit",
    description:
      "Complete professional set with 12 polycarbonate cups, precision pistol pump, and hard-shell carry case. The therapist's first choice for controlled suction.",
    price: 8500,
    stock: 25,
    features: [
      "12 graduated cup sizes (No. 1–7)",
      "Precision vacuum pistol with release valve",
      "Extension tubing included",
      "Hard-shell carry case",
    ],
    badge: "Best Seller",
    badge_variant: "default",
    categorySlug: "complete-kits",
    is_featured: true,
    imageSources: [pexelsPhoto(8313420), pexelsPhoto(8313234)],
  },
  {
    name: "Premium Silicone Cup Set",
    slug: "premium-silicone-cup-set",
    description:
      "Flexible medical-grade silicone cups in six sizes. Ideal for dry cupping, massage cupping, and moving cupping techniques.",
    price: 3200,
    stock: 40,
    features: [
      "Medical-grade silicone",
      "6 sizes in one set",
      "Easy squeeze mechanism",
      "Autoclave-safe",
    ],
    badge: "Popular",
    badge_variant: "new",
    categorySlug: "hijama-cups",
    is_featured: true,
    imageSources: [pexelsPhoto(8312816)],
  },
  {
    name: "Complete Clinic Starter Kit",
    slug: "complete-clinic-starter-kit",
    description:
      "Everything a new clinic needs: cups, pump, lancets, blades, gloves, antiseptic, and a practitioner guide. Start practising from day one.",
    price: 15500,
    stock: 15,
    features: [
      "Full cup & pump set",
      "Starter consumables pack",
      "Printed practitioner guide",
      "Clinic-grade storage bag",
    ],
    badge: "Clinic Kit",
    badge_variant: "gold",
    categorySlug: "complete-kits",
    is_featured: true,
    imageSources: [pexelsPhoto(8313420), pexelsPhoto(8313254)],
  },
  {
    name: "Polycarbonate Cup Set (No. 1–7)",
    slug: "polycarbonate-cup-set-7",
    description:
      "Crystal-clear clinic-grade polycarbonate cups numbered 1 through 7. Durable, easy to sterilise, and trusted in daily wet cupping practice.",
    price: 4500,
    stock: 35,
    features: [
      "7 numbered cup sizes",
      "Clinic-grade polycarbonate",
      "Smooth rim for patient comfort",
      "Compatible with standard pumps",
    ],
    categorySlug: "hijama-cups",
    is_featured: false,
    imageSources: [pexelsPhoto(8313420)],
  },
  {
    name: "Glass Hijama Cup Set (6 pcs)",
    slug: "glass-hijama-cup-set-6",
    description:
      "Traditional fire-cupping glass set with six classic bell cups. Preferred by practitioners trained in classical Hijama techniques.",
    price: 5800,
    stock: 22,
    features: [
      "6 heat-resistant glass cups",
      "Classic bell profile",
      "Hand-finished rims",
      "Wooden storage box",
    ],
    badge: "Classic",
    badge_variant: "gold",
    categorySlug: "hijama-cups",
    is_featured: false,
    imageSources: [pexelsPhoto(8312816)],
  },
  {
    name: "Facial Mini Cup Set",
    slug: "facial-mini-cup-set",
    description:
      "Small-diameter cups designed for facial, neck, and joint work. Lightweight set for precision dry and massage cupping.",
    price: 2100,
    stock: 30,
    features: [
      "4 mini cup sizes",
      "Facial & joint work",
      "Soft silicone squeeze cups",
      "Travel pouch included",
    ],
    categorySlug: "hijama-cups",
    is_featured: false,
    imageSources: [unsplashPhoto("1579684385127-1ef15d508118")],
  },
  {
    name: "Student Training Kit",
    slug: "student-training-kit",
    description:
      "Affordable entry kit for Hijama courses and trainees. Includes essential cups, a manual pump, and a step-by-step practice guide.",
    price: 6500,
    stock: 20,
    features: [
      "8 essential cup sizes",
      "Manual pistol pump",
      "Trainee practice guide",
      "Compact carry bag",
    ],
    badge: "New",
    badge_variant: "new",
    categorySlug: "complete-kits",
    is_featured: false,
    imageSources: [pexelsPhoto(8313234)],
  },
  {
    name: "Professional Vacuum Pistol Pump",
    slug: "professional-vacuum-pistol-pump",
    description:
      "Ergonomic pistol-grip pump with smooth trigger action and quick-release valve. Fits standard Hijama tubing and cup connectors.",
    price: 2800,
    stock: 45,
    features: [
      "Pistol-grip ergonomics",
      "Quick-release valve",
      "Standard tube connector",
      "Replaceable seals",
    ],
    categorySlug: "accessories",
    is_featured: false,
    imageSources: [pexelsPhoto(8312816)],
  },
  {
    name: "Electric Vacuum Pump Pro",
    slug: "electric-vacuum-pump-pro",
    description:
      "Adjustable electric vacuum unit for busy clinics. Consistent suction levels, quiet motor, and hands-free operation during sessions.",
    price: 12000,
    stock: 12,
    features: [
      "Adjustable suction levels",
      "Quiet clinic-grade motor",
      "Digital pressure readout",
      "Auto shut-off protection",
    ],
    badge: "Pro",
    badge_variant: "gold",
    categorySlug: "accessories",
    is_featured: true,
    imageSources: [pexelsPhoto(5473182)],
  },
  {
    name: "Extension Tube & Valve Set",
    slug: "extension-tube-valve-set",
    description:
      "Replacement tubing, inline valves, and connectors for vacuum pumps. Keep spare parts on hand for uninterrupted clinic days.",
    price: 950,
    stock: 60,
    features: [
      "Medical-grade tubing",
      "Inline release valves",
      "Universal connectors",
      "Spare parts pack",
    ],
    categorySlug: "accessories",
    is_featured: false,
    imageSources: [pexelsPhoto(6628933)],
  },
  {
    name: "Hijama Practitioner Carry Case",
    slug: "hijama-practitioner-case",
    description:
      "Padded hard case with custom dividers for cups, pumps, and consumables. Professional look for home visits and clinic storage.",
    price: 3400,
    stock: 18,
    features: [
      "Shock-absorbing padding",
      "Adjustable dividers",
      "Lockable latches",
      "Shoulder strap included",
    ],
    categorySlug: "accessories",
    is_featured: false,
    imageSources: [pexelsPhoto(8313221)],
  },
  {
    name: "Sterile Lancets (Box of 100)",
    slug: "sterile-lancets-100",
    description:
      "Single-use sterile lancets for controlled incisions during wet cupping. Individually packed for hygienic clinic practice.",
    price: 450,
    stock: 80,
    features: [
      "Individually sterile wrapped",
      "Consistent sharp point",
      "Box of 100 units",
      "Clinic bulk pricing",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [pexelsPhoto(8460156)],
  },
  {
    name: "Disposable Scalpel Blades (50 pcs)",
    slug: "disposable-scalpel-blades-50",
    description:
      "Sterile disposable blades compatible with standard handles. Essential restock for wet Hijama and clinical cupping sessions.",
    price: 380,
    stock: 70,
    features: [
      "Sterile individually packed",
      "Standard No. 11 blade",
      "50 blades per box",
      "ISO-certified production",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [pexelsPhoto(8460157)],
  },
  {
    name: "Nitrile Gloves (Box of 100)",
    slug: "nitrile-gloves-box-100",
    description:
      "Powder-free nitrile examination gloves. Latex-free, tactile, and suitable for long Hijama clinic sessions.",
    price: 890,
    stock: 55,
    features: [
      "Powder-free nitrile",
      "Latex-free",
      "Ambidextrous fit",
      "Box of 100 gloves",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [pexelsPhoto(8418699)],
  },
  {
    name: "Antiseptic Solution 500ml",
    slug: "antiseptic-solution-500ml",
    description:
      "Clinic-size antiseptic for skin preparation before and after cupping. Gentle on skin, effective against common bacteria.",
    price: 650,
    stock: 40,
    features: [
      "500ml clinic bottle",
      "Pre & post-session prep",
      "Skin-friendly formula",
      "Pump dispenser cap",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [pexelsPhoto(7659564)],
  },
];

/** Local public paths after images are downloaded (see `npm run seed`). */
export function productImagePaths(slug: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `/products/${slug}-${i + 1}.jpg`);
}
