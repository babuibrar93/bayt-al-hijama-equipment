"use client";

import { useCounterAnimation } from "@/hooks/useCounterAnimation";

interface CounterStatProps {
  target: number;
  suffix: string;
  label: string;
}

export default function CounterStat({ target, suffix, label }: CounterStatProps) {
  const { ref, value } = useCounterAnimation(target);

  return (
    <div className="flex flex-col px-9 first:pl-0 max-md:first:pl-9">
      <span
        className="font-display text-[2.4rem] font-semibold leading-none text-gold"
        ref={ref}
        data-target={target}
      >
        {value}
      </span>
      <span className="font-display text-[1.6rem] font-normal text-gold">{suffix}</span>
      <span className="mt-1 text-[0.75rem] tracking-[0.05em] text-white/50">{label}</span>
    </div>
  );
}
