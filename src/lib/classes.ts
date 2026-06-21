import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const container =
  "mx-auto w-full max-w-container px-6";

export const section =
  "relative py-[120px] max-sm:py-20";

export const sectionEyebrow =
  "mb-5 inline-flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold before:h-px before:w-6 before:bg-gold before:content-['']";

export const sectionTitle =
  "mb-5 font-display text-[clamp(2.2rem,4vw,3.8rem)] font-normal leading-[1.15] tracking-[-0.01em] text-white [&_em]:italic [&_em]:text-gold";

export const sectionSub =
  "mb-16 max-w-[520px] text-base text-white/60";

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
    "absolute left-5 top-5 z-[2] rounded-full px-3.5 py-[5px] text-[0.7rem] font-bold uppercase tracking-[0.08em]";

  switch (variant) {
    case "new":
      return cn(
        base,
        "border border-gold/30 bg-gold/20 text-gold",
      );
    case "gold":
      return cn(base, "border border-gold bg-transparent text-gold");
    default:
      return cn(base, "bg-green-mid text-white");
  }
}

export function scrollToSection(hash: string, offset = 80): void {
  const target = document.querySelector(hash);
  if (!target) return;

  const top =
    target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}
