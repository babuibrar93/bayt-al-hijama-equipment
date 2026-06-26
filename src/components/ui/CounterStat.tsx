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
    <div className="flex min-w-[5.5rem] flex-col px-4 first:pl-0 sm:min-w-0 sm:px-6 sm:first:pl-0 md:px-9">
      <span
        className="font-body text-[1.75rem] font-semibold tabular-nums leading-none text-gold sm:text-[2rem] md:text-[2.4rem]"
        ref={ref}
        data-target={target}
      >
        {value}
      </span>
      <span className="font-body text-[1.1rem] font-normal tabular-nums text-gold sm:text-[1.35rem] md:text-[1.6rem]">
        {suffix}
      </span>
      <span className="mt-1 text-[0.68rem] tracking-[0.04em] text-white/50 sm:text-[0.75rem] sm:tracking-[0.05em]">
        {label}
      </span>
    </div>
  );
}
