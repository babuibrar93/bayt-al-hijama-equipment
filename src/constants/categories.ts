import { WHATSAPP } from "@/constants/whatsapp";
import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    number: "01",
    title: "Hijama Cups",
    description:
      "Glass, silicone, and plastic cups in all sizes. Wet cupping, dry cupping, and massage cupping varieties available.",
    whatsappUrl: WHATSAPP.categories.cups,
    iconId: "cups",
  },
  {
    number: "02",
    title: "Complete Kits",
    description:
      "All-in-one kits for therapists and clinics. Includes cups, pump, lancet device, and accessories. Ready to practise.",
    whatsappUrl: WHATSAPP.categories.kits,
    iconId: "kits",
  },
  {
    number: "03",
    title: "Accessories",
    description:
      "Vacuum pumps, pressure gauges, extension tubing, and storage cases to complete your professional setup.",
    whatsappUrl: WHATSAPP.categories.accessories,
    iconId: "accessories",
  },
  {
    number: "04",
    title: "Consumables",
    description:
      "Sterile lancets, disposable blades, surgical gloves, antiseptic solutions, and gauze. Hygiene products in bulk for clinics.",
    whatsappUrl: WHATSAPP.categories.consumables,
    iconId: "consumables",
  },
];
