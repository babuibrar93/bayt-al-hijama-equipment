import { Globe, Phone, Share2, Truck, Users } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/icons/BrandIcons";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { MARQUEE_ITEMS, type MarqueeIconId } from "@/constants/marquee";
import { typeMeta } from "@/lib/classes";

const ICON_SIZE = 14;

function MarqueeIcon({ id }: { id: MarqueeIconId }) {
  switch (id) {
    case "facebook":
      return <FacebookIcon size={ICON_SIZE} />;
    case "instagram":
      return <InstagramIcon size={ICON_SIZE} />;
    case "whatsapp":
      return <WhatsAppIcon size={ICON_SIZE} />;
    case "phone":
      return <Phone className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />;
    case "share":
      return <Share2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />;
    case "truck":
      return <Truck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />;
    case "users":
      return <Users className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />;
    case "globe":
      return <Globe className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />;
  }
}

export default function MarqueeSection() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      className="overflow-hidden border-y border-glass-border bg-gold/5 py-2.5"
      aria-label="Promotional updates"
    >
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap motion-reduce:animate-none">
        {items.map((item, index) =>
          item.href ? (
            <a
              key={`item-${item.icon}-${index}`}
              href={item.href}
              target={item.href.startsWith("tel:") ? undefined : "_blank"}
              rel={
                item.href.startsWith("tel:")
                  ? undefined
                  : "noopener noreferrer"
              }
              className="group inline-flex items-center gap-2.5"
            >
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-mid text-white transition-colors group-hover:bg-green-light">
                <MarqueeIcon id={item.icon} />
              </span>
              <span
                className={`${typeMeta} font-medium uppercase tracking-[0.12em] text-white transition-colors group-hover:text-gold`}
              >
                {item.label}
              </span>
            </a>
          ) : (
            <span
              key={`item-${item.icon}-${index}`}
              className="inline-flex items-center gap-2.5"
            >
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-mid text-white">
                <MarqueeIcon id={item.icon} />
              </span>
              <span
                className={`${typeMeta} font-medium uppercase tracking-[0.12em] text-white`}
              >
                {item.label}
              </span>
            </span>
          ),
        )}
      </div>
    </div>
  );
}
