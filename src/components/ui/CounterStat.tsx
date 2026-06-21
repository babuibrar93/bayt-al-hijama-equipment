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
    <div className="hero__stat">
      <span className="hero__stat-num" ref={ref} data-target={target}>
        {value}
      </span>
      <span className="hero__stat-suffix">{suffix}</span>
      <span className="hero__stat-label">{label}</span>
    </div>
  );
}
