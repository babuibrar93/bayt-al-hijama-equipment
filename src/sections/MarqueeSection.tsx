import { MARQUEE_ITEMS } from "@/constants/site";

export default function MarqueeSection() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.flatMap((item, index) => [
          <span key={`text-${item}-${index}`}>{item}</span>,
          <span key={`dot-${item}-${index}`} className="marquee__dot">
            ✦
          </span>,
        ])}
      </div>
    </div>
  );
}
