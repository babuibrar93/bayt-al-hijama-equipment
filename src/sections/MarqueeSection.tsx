import { MARQUEE_ITEMS } from "@/constants/site";

export default function MarqueeSection() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      className="overflow-hidden border-y border-glass-border bg-green-mid/5 py-[18px]"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {items.flatMap((item, index) => [
          <span
            key={`text-${item}-${index}`}
            className="text-[0.78rem] font-medium uppercase tracking-[0.12em] text-white/50"
          >
            {item}
          </span>,
          <span key={`dot-${item}-${index}`} className="text-gold">
            ✦
          </span>,
        ])}
      </div>
    </div>
  );
}
