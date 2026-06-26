import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const container =
  "mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8";

export const section =
  "relative py-10 md:py-12 lg:py-14";

/** First block inside AnimatedSectionBand (e.g. Trust). */
export const sectionBandFirst =
  "relative pt-10 pb-6 md:pt-12 md:pb-8 lg:pt-14";

/** Second block in the same band (e.g. Categories) — bottom padding matches `section` rhythm. */
export const sectionBandSecond =
  "relative pt-6 pb-10 md:pt-8 md:pb-12 lg:pt-10 lg:pb-14";

/** Standard page shell for shop / account sub-pages */
export const pageShell =
  "px-4 pb-16 pt-nav sm:px-6 lg:pb-20";

export const pageInner =
  "mx-auto w-full max-w-container pt-4 sm:pt-5";

/** Consistent, highly-readable numeric styling (prices, counts, stats). */
export const numeric = "font-body tabular-nums";

export const sectionEyebrow =
  "mb-2 flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold sm:gap-x-3 sm:text-[0.72rem] sm:tracking-[0.2em] before:h-px before:w-5 before:shrink-0 before:bg-gold before:content-[''] sm:before:w-6";

export const sectionTitle =
  "mb-1 font-body text-[clamp(1.2rem,4.5vw,2rem)] font-semibold leading-[1.2] tracking-[-0.01em] text-white [&_em]:font-normal [&_em]:italic [&_em]:text-gold";

export const sectionSub =
  "mb-4 max-w-[540px] text-[0.875rem] leading-relaxed text-white/60 sm:text-sm";

export const revealUp =
  "opacity-0 translate-y-9 transition-all duration-[800ms] ease-out visible-state:opacity-100 visible-state:translate-y-0";

export const revealLeft =
  "opacity-0 -translate-x-10 transition-all duration-[800ms] ease-out visible-state:opacity-100 visible-state:translate-x-0 max-md:translate-x-0 max-md:translate-y-6 max-md:opacity-0 max-md:visible-state:translate-y-0";

export const revealRight =
  "opacity-0 translate-x-10 transition-all duration-[800ms] ease-out visible-state:opacity-100 visible-state:translate-x-0 max-md:translate-x-0 max-md:translate-y-6 max-md:opacity-0 max-md:visible-state:translate-y-0";

export const revealDelay = {
  1: "delay-100",
  2: "delay-200",
  3: "delay-300",
  4: "delay-[400ms]",
} as const;

export const btnBase =
  "relative inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-sm px-7 py-3.5 text-[0.88rem] font-semibold tracking-[0.04em] transition-all duration-[250ms] ease-spring hover:-translate-y-0.5 active:translate-y-0 before:pointer-events-none before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-[250ms] hover:before:opacity-100";

export const btnPrimary =
  "relative inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-sm px-7 py-3.5 text-[0.88rem] font-semibold tracking-[0.04em] transition-all duration-[250ms] ease-spring hover:-translate-y-0.5 active:translate-y-0 before:pointer-events-none before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-[250ms] hover:before:opacity-100 bg-green-mid text-white shadow-[0_4px_24px_rgba(27,107,71,0.35)] hover:shadow-[0_8px_32px_rgba(27,107,71,0.5)]";

export const btnGhost =
  "relative inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-sm px-7 py-3.5 text-[0.88rem] font-semibold tracking-[0.04em] transition-all duration-[250ms] ease-spring hover:-translate-y-0.5 active:translate-y-0 before:pointer-events-none before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-[250ms] hover:before:opacity-100 border border-glass-border bg-transparent text-white/80 hover:border-white/30 hover:text-white";

export const btnLarge =
  "rounded-[10px] px-9 py-[18px] text-[0.95rem]";

export const glassCard =
  "rounded-lg border border-glass-border bg-glass-bg transition-all duration-[350ms]";

export const featureCard =
  "group relative overflow-hidden rounded-xl border border-glass-border bg-glass-bg transition-all duration-[350ms] ease-spring hover:-translate-y-1.5 hover:border-gold/25 hover:bg-glass-bg-hover hover:shadow-[0_12px_40px_rgba(27,107,71,0.12)]";

export const featureCardIcon =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-green-mid/30 bg-green-mid/10 transition-colors duration-[350ms] group-hover:border-gold/30 group-hover:bg-gold/10 sm:h-11 sm:w-11 [&_svg]:h-[22px] [&_svg]:w-[22px] sm:[&_svg]:h-[26px] sm:[&_svg]:w-[26px]";

export const featureCardIndex =
  "flex h-6 min-w-[1.6rem] shrink-0 items-center justify-center rounded-md border border-gold/25 bg-gold/10 px-1.5 font-body text-[0.62rem] font-bold tabular-nums tracking-wide text-gold sm:h-7 sm:min-w-[1.75rem] sm:text-[0.68rem]";

export const navLink =
  "relative text-[0.85rem] font-medium uppercase tracking-[0.08em] text-white/60 transition-colors duration-[250ms] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 after:ease-out hover:text-white hover:after:w-full";

export function getRevealClass(
  variant: "up" | "left" | "right",
  delay?: 1 | 2 | 3 | 4,
): string {
  const base =
    variant === "left"
      ? revealLeft
      : variant === "right"
        ? revealRight
        : revealUp;

  return cn(base, delay ? revealDelay[delay] : undefined);
}

export function getBadgeClass(
  variant: "default" | "new" | "gold",
): string {
  const base =
    "absolute left-3 top-3 z-10 rounded-lg px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.08em] shadow-[0_4px_16px_rgba(0,0,0,0.5)] sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[0.68rem]";

  switch (variant) {
    case "new":
      return cn(
        base,
        "border border-gold/50 bg-[#0a120e]/95 text-gold-light backdrop-blur-[2px]",
      );
    case "gold":
      return cn(
        base,
        "border border-gold/55 bg-[#141008]/95 text-gold-light backdrop-blur-[2px]",
      );
    default:
      return cn(
        base,
        "border border-green-light/40 bg-green-deep/95 text-white backdrop-blur-[2px]",
      );
  }
}

/** Top gradient so image badges stay readable on bright photos */
export const productBadgeScrim =
  "pointer-events-none absolute inset-x-0 top-0 z-[2] h-14 bg-gradient-to-b from-black/80 via-black/40 to-transparent sm:h-16";

export function scrollToSection(hash: string, offset = 80): void {
  const target = document.querySelector(hash);
  if (!target) return;

  const top =
    target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}
