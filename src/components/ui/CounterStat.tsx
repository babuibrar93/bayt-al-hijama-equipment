import { typeEyebrow, typeStat, typeStatSuffix } from "@/lib/classes";

interface CounterStatProps {
  target: number;
  suffix: string;
  label: string;
}

/** Final figure is in the HTML so the hero does not hydrate a count-up loop. */
export default function CounterStat({ target, suffix, label }: CounterStatProps) {
  return (
    <div className="flex min-w-[5.5rem] flex-col px-4 first:pl-0 sm:min-w-0 sm:px-6 sm:first:pl-0 md:px-9">
      <span
        className={`font-body font-semibold tabular-nums leading-none text-gold ${typeStat}`}
      >
        {target}
        <span className={`font-normal ${typeStatSuffix}`}>{suffix}</span>
      </span>
      <span className={`mt-1 tracking-[0.04em] text-white/50 ${typeEyebrow}`}>
        {label}
      </span>
    </div>
  );
}
