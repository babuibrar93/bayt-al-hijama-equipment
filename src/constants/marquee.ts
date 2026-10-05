import { SITE } from "@/constants/site";
import { WHATSAPP } from "@/constants/whatsapp";
import { FOOTER_SOCIAL } from "@/constants/footer";

const facebook = FOOTER_SOCIAL.find((s) => s.label === "Facebook")!.href;
const instagram = FOOTER_SOCIAL.find((s) => s.label === "Instagram")!.href;

export type MarqueeIconId =
  | "facebook"
  | "instagram"
  | "phone"
  | "whatsapp"
  | "share"
  | "truck"
  | "users"
  | "globe";

export type MarqueeItem = {
  icon: MarqueeIconId;
  label: string;
  href?: string;
};

export const MARQUEE_ITEMS: MarqueeItem[] = [
  {
    icon: "facebook",
    label: "Follow us on Facebook",
    href: facebook,
  },
  {
    icon: "instagram",
    label: "Follow @hijamaequipmentofficial",
    href: instagram,
  },
  {
    icon: "phone",
    label: SITE.phone,
    href: `tel:${SITE.phoneRaw}`,
  },
  {
    icon: "whatsapp",
    label: "Order on WhatsApp",
    href: WHATSAPP.mobile,
  },
  {
    icon: "share",
    label: "Share with fellow therapists",
  },
  {
    icon: "truck",
    label: "Delivery All Over Pakistan",
  },
  {
    icon: "users",
    label: "Trusted by 1000+ Therapists",
  },
  {
    icon: "globe",
    label: "baytalhijama.com",
    href: SITE.url,
  },
];
