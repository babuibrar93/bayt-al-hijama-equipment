export function scrollToSection(hash: string, offset = 80): void {
  const target = document.querySelector(hash);
  if (!target) return;

  const top =
    target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

export { cn, getRevealClass } from "@/lib/classes";

const rupeeFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

const plainFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  useGrouping: false,
});

/** Nearest paisa as an integer. Does not round a price up to the next rupee. */
function toPaisa(amount: number): number {
  const value = Number(amount);
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100);
}

function priceParts(amount: number): {
  sign: string;
  rupees: number;
  fraction: string;
} {
  const paisa = toPaisa(amount);
  const sign = paisa < 0 ? "-" : "";
  const abs = Math.abs(paisa);
  const frac = abs % 100;
  return {
    sign,
    rupees: Math.floor(abs / 100),
    fraction: frac === 0 ? "" : String(frac).padStart(2, "0").replace(/0$/, ""),
  };
}

/**
 * Formats a PKR amount without rounding to a whole rupee.
 * 8500 -> "Rs 8,500". 23.5 -> "Rs 23.5". 23.55 -> "Rs 23.55".
 */
export function formatPrice(amount: number): string {
  const { sign, rupees, fraction } = priceParts(amount);
  const whole = rupeeFormatter.format(rupees);
  return fraction
    ? `Rs ${sign}${whole}.${fraction}`
    : `Rs ${sign}${whole}`;
}

/** Digits for copy/paste. 23.5 stays "23.5", 8500 stays "8500". */
export function formatPricePlain(amount: number): string {
  const { sign, rupees, fraction } = priceParts(amount);
  const whole = plainFormatter.format(rupees);
  return fraction ? `${sign}${whole}.${fraction}` : `${sign}${whole}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
