import { WHATSAPP } from "@/constants/whatsapp";
import { SITE } from "@/constants/site";
import type { FooterLinkGroup } from "@/types";

export const FOOTER_PRODUCT_LINKS: FooterLinkGroup = {
  title: "Products",
  links: [
    { label: "Hijama Cups", href: WHATSAPP.footer.cups },
    { label: "Complete Kits", href: WHATSAPP.footer.kits },
    { label: "Accessories", href: WHATSAPP.footer.accessories },
    { label: "Consumables", href: WHATSAPP.footer.consumables },
    { label: "Bulk Orders", href: WHATSAPP.footer.bulk },
  ],
};

export const FOOTER_PROFESSIONAL_LINKS: FooterLinkGroup = {
  title: "For Professionals",
  links: [
    { label: "Hijama Therapists", href: WHATSAPP.footer.therapists },
    { label: "Clinic Owners", href: WHATSAPP.footer.clinics },
    { label: "Training Institutes", href: WHATSAPP.footer.institutes },
    { label: "Students", href: WHATSAPP.footer.students },
    { label: "Wellness Centers", href: WHATSAPP.footer.wellness },
  ],
};

export const CTA_TRUST_ITEMS = [
  "✦ Fast Response",
  "✦ No Minimum Order",
  "✦ Bulk Discounts Available",
  "✦ All Pakistan Delivery",
] as const;

export const FOOTER_CONTACT = {
  phone: SITE.phone,
  phoneHref: `tel:${SITE.phoneRaw}`,
  whatsappHref: WHATSAPP.mobile,
  location: SITE.delivery,
};
