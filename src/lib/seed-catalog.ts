/**
 * Single source of truth for shop seed data.
 * Used by `npm run seed` and static fallback when Supabase is not configured.
 */

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
  cost_price: number | null;
  stock: number;
  features: string[];
  categorySlug: string;
  is_featured: boolean;
  /** Remote URLs; empty = no images (admin uploads later) */
  imageSources: string[];
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    name: "Hijama Cups",
    slug: "hijama-cups",
    description:
      "Individual cup sizes and silicone massage cup sets for wet, dry, and massage cupping.",
    sort_order: 1,
  },
  {
    name: "Pumps & Machines",
    slug: "pumps-machines",
    description:
      "Manual, disposable, rechargeable, and electric vacuum pumps for clinic and home use.",
    sort_order: 2,
  },
  {
    name: "Consumables",
    slug: "consumables",
    description:
      "Gloves, gowns, masks, bed sheets, blades, lancets, tape, and clinic disposables.",
    sort_order: 3,
  },
  {
    name: "Therapy Tools",
    slug: "therapy-tools",
    description:
      "Hijama pens, massage rollers, foot massagers, and blade holders for practitioners.",
    sort_order: 4,
  },
];

const STOCK = 20;

function mfCup(n: string, cost: number): SeedProduct {
  return {
    name: `MF ${n}`,
    slug: `mf-${n}`,
    description: `Hijama cup size MF ${n}. Clinic-ready polycarbonate cup for controlled suction during wet and dry cupping sessions.`,
    price: 27,
    cost_price: cost,
    stock: STOCK,
    features: [
      `Size MF ${n}`,
      "Compatible with standard Hijama pumps",
      "Smooth rim for patient comfort",
      "Easy to clean and reuse",
    ],
    categorySlug: "hijama-cups",
    is_featured: n === "01" || n === "02",
    imageSources: [],
  };
}

export const SEED_PRODUCTS: SeedProduct[] = [
  mfCup("01", 22.5),
  mfCup("02", 21),
  mfCup("03", 19),
  mfCup("04", 18),
  mfCup("05", 17),
  mfCup("06", 17),
  {
    name: "Disposable Bed Sheet (10pcs Pack)",
    slug: "disposable-bed-sheet-10pcs",
    description:
      "Pack of 10 disposable bed sheets for hygienic clinic and home Hijama sessions. Single-use coverage for treatment beds.",
    price: 800,
    cost_price: 680,
    stock: STOCK,
    features: [
      "10 sheets per pack",
      "Disposable single-use",
      "Clinic hygiene standard",
      "Fits standard treatment beds",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Electronic Hijama Pump (Rechargeable)",
    slug: "electronic-hijama-pump-rechargeable",
    description:
      "Rechargeable electronic Hijama vacuum pump for consistent suction without manual pumping. Ideal for busy clinics and home visits.",
    price: 3500,
    cost_price: 2900,
    stock: STOCK,
    features: [
      "Rechargeable battery",
      "Consistent electronic suction",
      "Portable for home visits",
      "Compatible with standard cups",
    ],
    categorySlug: "pumps-machines",
    is_featured: true,
    imageSources: [],
  },
  {
    name: "Electric Hijama Vacuum Machine for Head",
    slug: "electric-hijama-vacuum-machine-head",
    description:
      "Electric Hijama vacuum machine designed for head and specialised cupping work. High-capacity clinic unit for professional practice.",
    price: 16000,
    cost_price: null,
    stock: STOCK,
    features: [
      "Electric vacuum machine",
      "Suitable for head cupping",
      "Clinic-grade performance",
      "Stable continuous suction",
    ],
    categorySlug: "pumps-machines",
    is_featured: true,
    imageSources: [],
  },
  {
    name: "Disposable Small Pump",
    slug: "disposable-small-pump",
    description:
      "Compact disposable small vacuum pump for head and precision cupping. Hygienic single-use option for clinical sessions.",
    price: 200,
    cost_price: 160,
    stock: STOCK,
    features: [
      "Compact disposable design",
      "Ideal for head/small cups",
      "Single-use hygiene",
      "Lightweight and portable",
    ],
    categorySlug: "pumps-machines",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Regular White Pump",
    slug: "regular-white-pump",
    description:
      "Standard white manual Hijama vacuum pump for everyday wet and dry cupping. Reliable trigger action for controlled suction.",
    price: 400,
    cost_price: 300,
    stock: STOCK,
    features: [
      "Manual pistol-style pump",
      "White clinic finish",
      "Quick-release valve",
      "Fits standard tubing",
    ],
    categorySlug: "pumps-machines",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Hijama Vacuum Pump (600)",
    slug: "hijama-vacuum-pump-600",
    description:
      "Manual Hijama vacuum pump — standard grade. Smooth suction control for routine clinic and home cupping sessions.",
    price: 600,
    cost_price: 500,
    stock: STOCK,
    features: [
      "Manual vacuum pump",
      "Standard clinic grade",
      "Release valve included",
      "Compatible with MF cups",
    ],
    categorySlug: "pumps-machines",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Hijama Vacuum Pump (700)",
    slug: "hijama-vacuum-pump-700",
    description:
      "Manual Hijama vacuum pump — higher grade build. Preferred when you need firmer, more durable daily clinic use.",
    price: 700,
    cost_price: 570,
    stock: STOCK,
    features: [
      "Manual vacuum pump",
      "Higher-grade build",
      "Durable for daily use",
      "Compatible with MF cups",
    ],
    categorySlug: "pumps-machines",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Polythene Gloves",
    slug: "polythene-gloves",
    description:
      "Disposable polythene gloves for basic hygiene during preparation and cleanup. Affordable pack for high-volume clinic use.",
    price: 80,
    cost_price: 45,
    stock: STOCK,
    features: [
      "Disposable polythene",
      "Basic hygiene protection",
      "Lightweight fit",
      "Clinic bulk friendly",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Disposable Surgical Gloves (Safety)",
    slug: "disposable-surgical-gloves-safety",
    description:
      "Disposable surgical gloves — Safety brand. Powder-ready examination gloves for wet Hijama and clinical procedures.",
    price: 1500,
    cost_price: 1080,
    stock: STOCK,
    features: [
      "Safety brand",
      "Surgical / examination grade",
      "Disposable single-use",
      "Clinic pack sizing",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Disposable Surgical Gloves (Life Care)",
    slug: "disposable-surgical-gloves-life-care",
    description:
      "Disposable surgical gloves — Life Care brand. Reliable tactile grip for practitioners during wet cupping sessions.",
    price: 1400,
    cost_price: 1000,
    stock: STOCK,
    features: [
      "Life Care brand",
      "Surgical / examination grade",
      "Disposable single-use",
      "Good tactile feel",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Surgical Blade (China)",
    slug: "surgical-blade-china",
    description:
      "Surgical blades (China) for controlled incisions in wet Hijama. Sterile clinic stock for professional practitioners.",
    price: 1050,
    cost_price: 730,
    stock: STOCK,
    features: [
      "China-origin blades",
      "Sharp consistent edge",
      "Clinic bulk pack",
      "Use with standard holders",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Surgical Blade Holder",
    slug: "surgical-blade-holder",
    description:
      "Standard surgical blade holder for wet Hijama blades. Secure grip and easy blade change between sterile packs.",
    price: 100,
    cost_price: 70,
    stock: STOCK,
    features: [
      "Standard blade compatibility",
      "Secure locking grip",
      "Reusable metal holder",
      "Clinic essential",
    ],
    categorySlug: "therapy-tools",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Disposable Surgical Gown (10pcs Pack)",
    slug: "disposable-surgical-gown-10pcs",
    description:
      "Pack of 10 disposable surgical gowns for practitioner and patient protection during clinical Hijama sessions.",
    price: 1100,
    cost_price: 850,
    stock: STOCK,
    features: [
      "10 gowns per pack",
      "Disposable protective wear",
      "Lightweight non-woven",
      "Clinic hygiene standard",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Surgeon Cap (100 Pcs Pack)",
    slug: "surgeon-cap-100pcs",
    description:
      "Pack of 100 disposable surgeon caps. Keep hair covered for hygienic clinic and procedure rooms.",
    price: 350,
    cost_price: 200,
    stock: STOCK,
    features: [
      "100 caps per pack",
      "Disposable bouffant style",
      "Breathable material",
      "Clinic bulk pack",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Face Mask",
    slug: "face-mask",
    description:
      "Disposable face masks for practitioner and clinic staff hygiene during Hijama and patient care.",
    price: 250,
    cost_price: 170,
    stock: STOCK,
    features: [
      "Disposable face mask",
      "Comfortable ear loops",
      "Clinic hygiene use",
      "Everyday restock item",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Fix Tape Roll",
    slug: "fix-tape-roll",
    description:
      "Medical fix tape roll for securing dressings and aftercare pads following wet cupping sessions.",
    price: 450,
    cost_price: 280,
    stock: STOCK,
    features: [
      "Medical fix / micropore style",
      "Secure dressing hold",
      "Clinic aftercare essential",
      "Easy tear application",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Alcohol Pads",
    slug: "alcohol-pads",
    description:
      "Alcohol prep pads for skin cleansing before and after Hijama. Individually wrapped for sterile clinic use.",
    price: 450,
    cost_price: 250,
    stock: STOCK,
    features: [
      "Individually wrapped pads",
      "Pre & post-session prep",
      "Quick evaporating formula",
      "Clinic bulk pack",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Polythene Apron",
    slug: "polythene-apron",
    description:
      "Disposable polythene apron for splash protection during wet Hijama and clinic cleaning tasks.",
    price: 20,
    cost_price: 13,
    stock: STOCK,
    features: [
      "Disposable polythene",
      "Splash protection",
      "Lightweight tie-on",
      "Low-cost clinic consumable",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Hijama Pen Single Head",
    slug: "hijama-pen-single-head",
    description:
      "Single-head Hijama pen for precise controlled punctures during wet cupping. Practitioner favourite for accuracy.",
    price: 800,
    cost_price: 750,
    stock: STOCK,
    features: [
      "Single-head design",
      "Precise puncture control",
      "Ergonomic grip",
      "Clinic / training use",
    ],
    categorySlug: "therapy-tools",
    is_featured: true,
    imageSources: [],
  },
  {
    name: "Lancet Needle",
    slug: "lancet-needle",
    description:
      "Sterile lancet needles for wet Hijama incisions. Single-use points for hygienic, controlled technique.",
    price: 250,
    cost_price: 220,
    stock: STOCK,
    features: [
      "Sterile single-use lancets",
      "Consistent sharp point",
      "Wet cupping essential",
      "Clinic restock pack",
    ],
    categorySlug: "consumables",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Wood Massage Roller Type A",
    slug: "wood-massage-roller-type-a",
    description:
      "Wooden massage roller — Type A. Natural wood tool for body massage and post-cupping muscle relief.",
    price: 1100,
    cost_price: 850,
    stock: STOCK,
    features: [
      "Type A wooden roller",
      "Natural wood finish",
      "Body massage use",
      "Pairs with cupping therapy",
    ],
    categorySlug: "therapy-tools",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Wood Massage Roller Type B",
    slug: "wood-massage-roller-type-b",
    description:
      "Wooden massage roller — Type B. Alternate profile for deeper tissue work alongside Hijama sessions.",
    price: 1100,
    cost_price: 900,
    stock: STOCK,
    features: [
      "Type B wooden roller",
      "Deeper massage profile",
      "Natural wood finish",
      "Clinic & home use",
    ],
    categorySlug: "therapy-tools",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Silicone Massage Cup Set (4pcs)",
    slug: "silicone-massage-cup-set-4pcs",
    description:
      "Set of 4 silicone massage cups for dry and moving cupping. Soft, flexible cups for facial and body work.",
    price: 1350,
    cost_price: 900,
    stock: STOCK,
    features: [
      "4 silicone cups",
      "Massage / moving cupping",
      "Soft flexible grip",
      "Easy to clean",
    ],
    categorySlug: "hijama-cups",
    is_featured: true,
    imageSources: [],
  },
  {
    name: "Wood Foot Massager",
    slug: "wood-foot-massager",
    description:
      "Wooden foot massager for reflexology-style relief. Pair with cupping aftercare; set your sell and cost prices in admin.",
    price: 0,
    cost_price: null,
    stock: STOCK,
    features: [
      "Wooden foot massager",
      "Reflexology-style relief",
      "Natural wood construction",
      "Price editable in admin",
    ],
    categorySlug: "therapy-tools",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Regular Black Pump",
    slug: "regular-black-pump",
    description:
      "Standard black manual Hijama vacuum pump. Durable everyday pump for wet and dry cupping practice.",
    price: 500,
    cost_price: 350,
    stock: STOCK,
    features: [
      "Manual black pump",
      "Everyday clinic use",
      "Quick-release valve",
      "Standard cup connector",
    ],
    categorySlug: "pumps-machines",
    is_featured: false,
    imageSources: [],
  },
  {
    name: "Rotary Massage Cup Kit (8pcs)",
    slug: "rotary-massage-cup-kit-8pcs",
    description:
      "Rotary massage cup kit with 8 pieces for dynamic massage cupping. Complete set for therapists offering moving cupping.",
    price: 3200,
    cost_price: 2600,
    stock: STOCK,
    features: [
      "8-piece rotary kit",
      "Massage cupping set",
      "Therapist-ready pack",
      "Durable cup construction",
    ],
    categorySlug: "hijama-cups",
    is_featured: true,
    imageSources: [],
  },
];

/** Local public paths after images are downloaded (see `npm run seed`). */
export function productImagePaths(slug: string, count: number): string[] {
  return Array.from(
    { length: count },
    (_, i) => `/products/${slug}-${i + 1}.jpg`,
  );
}
