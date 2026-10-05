import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shared left/right page gutter — matches hero section text inset. */
export const pageGutter =
  "px-4 sm:px-6 md:px-8 lg:px-10 xl:px-[60px]";

/** Landing / site content width. No max-width so edges align with hero. */
export const container = `w-full ${pageGutter}`;

/** One card per row on phones; 2 / 3 / 4 columns as the screen grows. */
export const productGrid =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4";

export const section =
  "relative py-8 md:py-10 lg:py-12";

/** First block inside AnimatedSectionBand (e.g. Trust). */
export const sectionBandFirst =
  "relative pt-6 pb-4 md:pt-8 md:pb-5 lg:pt-10";

/** Second block in the same band (e.g. Categories) — bottom padding matches `section` rhythm. */
export const sectionBandSecond =
  "relative pt-4 pb-8 md:pt-5 md:pb-10 lg:pt-6 lg:pb-12";

/** Shop / account / detail shell — same horizontal gutter as landing. */
export const pageShell = `pb-16 pt-nav lg:pb-20 ${pageGutter}`;

export const pageInner = "w-full pt-4 sm:pt-5";

/** Consistent, highly-readable numeric styling (prices, counts, stats). */
export const numeric = "font-body tabular-nums";

/** Landing type scale — size-only tokens for consistent responsive text. */
export const typeEyebrow = "text-xs sm:text-[0.8125rem]";
export const typeMeta = "text-[0.78rem] sm:text-[0.82rem]";
export const typeBodySm = "text-[0.8125rem] sm:text-[0.875rem]";
export const typeBody = "text-[1rem]";
export const typeCardTitle = "text-[1rem] sm:text-[1.05rem]";
export const typeSectionTitle = "text-[clamp(1.2rem,4.5vw,2rem)]";
export const typeDisplay = "text-[clamp(2.5rem,4.5vw,4.5rem)]";
export const typeQuote = "text-[0.95rem] sm:text-[1.05rem]";
export const typeStat =
  "text-[1.75rem] sm:text-[2rem] md:text-[2.4rem]";
export const typeStatSuffix =
  "text-[1.1rem] sm:text-[1.35rem] md:text-[1.6rem]";
export const typeBtn = "text-[0.88rem]";
export const typeBtnSm = "text-[0.75rem] sm:text-[0.82rem]";

export const sectionEyebrow =
  `mb-2 flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 ${typeEyebrow} font-semibold uppercase tracking-[0.14em] text-gold sm:gap-x-3 sm:tracking-[0.2em] before:h-px before:w-5 before:shrink-0 before:bg-gold before:content-[''] sm:before:w-6`;

export const sectionTitle =
  `mb-1 font-body ${typeSectionTitle} font-semibold leading-[1.2] tracking-[-0.01em] text-white [&_em]:font-normal [&_em]:italic [&_em]:text-gold`;

export const sectionSub =
  `mb-4 max-w-[540px] ${typeBodySm} leading-relaxed text-white/60`;
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
  `relative inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-sm px-7 py-3.5 ${typeBtn} font-semibold tracking-[0.04em] transition-all duration-[250ms] ease-spring hover:-translate-y-0.5 active:translate-y-0 before:pointer-events-none before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-[250ms] hover:before:opacity-100`;

export const btnPrimary =
  `relative inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-sm px-7 py-3.5 ${typeBtn} font-semibold tracking-[0.04em] transition-all duration-[250ms] ease-spring hover:-translate-y-0.5 active:translate-y-0 before:pointer-events-none before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-[250ms] hover:before:opacity-100 bg-green-mid text-white shadow-[0_4px_24px_rgba(27,107,71,0.35)] hover:shadow-[0_8px_32px_rgba(27,107,71,0.5)]`;

export const btnGhost =
  `relative inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-sm px-7 py-3.5 ${typeBtn} font-semibold tracking-[0.04em] transition-all duration-[250ms] ease-spring hover:-translate-y-0.5 active:translate-y-0 before:pointer-events-none before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-[250ms] hover:before:opacity-100 border border-glass-border bg-transparent text-white/80 hover:border-white/30 hover:text-white`;

export const btnLarge =
  "rounded-[10px] px-9 py-[18px]";
export const glassCard =
  "rounded-lg border border-glass-border bg-glass-bg transition-all duration-[350ms]";

/** Shared field chrome — used by Input, Select, Textarea, and custom search/filter fields. */
export const fieldBorderTone = "border-white/20";

export const fieldBorder =
  `${fieldBorderTone} focus:border-gold/50`;

export const fieldBorderError =
  "border-red-500/50 focus:border-red-500/70";

export const featureCard =
  "group relative overflow-hidden rounded-xl border border-glass-border bg-glass-bg transition-all duration-[350ms] ease-spring hover:-translate-y-1.5 hover:border-gold/25 hover:bg-glass-bg-hover hover:shadow-[0_12px_40px_rgba(27,107,71,0.12)]";

export const featureCardIcon =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-green-mid/30 bg-green-mid/10 transition-colors duration-[350ms] group-hover:border-gold/30 group-hover:bg-gold/10 sm:h-11 sm:w-11 [&_svg]:h-[22px] [&_svg]:w-[22px] sm:[&_svg]:h-[26px] sm:[&_svg]:w-[26px]";

export const featureCardIndex =
  "flex h-6 min-w-[1.6rem] shrink-0 items-center justify-center rounded-md border border-gold/25 bg-gold/10 px-1.5 font-body text-[0.62rem] font-bold tabular-nums tracking-wide text-gold sm:h-7 sm:min-w-[1.75rem] sm:text-[0.68rem]";

export const navLink =
  "relative inline-flex min-h-11 items-center text-[0.85rem] font-medium uppercase tracking-[0.08em] text-white/60 transition-colors duration-[250ms] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 after:ease-out hover:text-white hover:after:w-full";

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

export function scrollToSection(hash: string, offset = 80): void {
  const target = document.querySelector(hash);
  if (!target) return;

  const top =
    target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}
