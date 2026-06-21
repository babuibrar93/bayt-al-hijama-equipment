import { WHATSAPP } from "@/constants/whatsapp";
import type { Product } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: "vacuum-kit",
    title: "Vacuum Pump Hijama Kit",
    description:
      "Complete professional set with 12 cups, precision pistol pump, and storage case. The therapist's first choice for controlled suction.",
    features: [
      "12 graduated cup sizes",
      "Precision vacuum pistol",
      "Release valve system",
      "Carry case included",
    ],
    badge: "Best Seller",
    badgeVariant: "default",
    whatsappUrl: WHATSAPP.products.vacuumKit,
    iconId: "vacuum-kit",
  },
  {
    id: "silicone-set",
    title: "Premium Silicone Cup Set",
    description:
      "Flexible medical-grade silicone cups in multiple sizes. Perfect for dry cupping, massage cupping, and moving cupping techniques.",
    features: [
      "Medical-grade silicone",
      "6 sizes in one set",
      "Easy squeeze mechanism",
      "Autoclave-safe",
    ],
    badge: "Popular",
    badgeVariant: "new",
    whatsappUrl: WHATSAPP.products.siliconeSet,
    iconId: "silicone-set",
  },
  {
    id: "clinic-kit",
    title: "Complete Clinic Starter Kit",
    description:
      "Everything a new clinic needs: cups, pump, lancets, disposable blades, gloves, and practitioner guide. Start practising from day one.",
    features: [
      "Full equipment set",
      "Consumables included",
      "Instructional guide",
      "Storage & carry bag",
    ],
    badge: "Clinic Kit",
    badgeVariant: "gold",
    whatsappUrl: WHATSAPP.products.clinicKit,
    iconId: "clinic-kit",
  },
];
