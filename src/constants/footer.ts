import { WHATSAPP } from "@/constants/whatsapp";
import { SITE } from "@/constants/site";
import type { FooterLinkGroup } from "@/types";

export const FOOTER_PRODUCT_LINKS: FooterLinkGroup = {
  title: "Products",
  links: [
    { label: "Hijama Cups", href: "/shop/category/hijama-cups" },
    { label: "Pumps & Machines", href: "/shop/category/pumps-machines" },
    { label: "Therapy Tools", href: "/shop/category/therapy-tools" },
    { label: "Consumables", href: "/shop/category/consumables" },
    { label: "All Products", href: "/shop" },
  ],
};

export const FOOTER_COMPANY_LINKS: FooterLinkGroup = {
  title: "Company",
  links: [
    { label: "About", href: "/about" },
    { label: "Delivery & Payment", href: "/delivery" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Bulk Orders", href: WHATSAPP.footer.bulk },
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

export const FOOTER_CREDIT = {
  label: "Website by",
  name: "Babu Ibrar",
  line: "I design and build websites. Want one for your business?",
  phone: "0344 4850952",
  phoneHref: "tel:03444850952",
  email: "babuibrar93@gmail.com",
  emailHref: "mailto:babuibrar93@gmail.com",
} as const;

export const FOOTER_SOCIAL = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/baytalhijamaequipment",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/hijamaequipmentofficial",
  },
  {
    label: "WhatsApp",
    href: WHATSAPP.mobile,
  },
] as const;
