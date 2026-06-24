export function scrollToSection(hash: string, offset = 80): void {
  const target = document.querySelector(hash);
  if (!target) return;

  const top =
    target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

export { cn, getBadgeClass, getRevealClass } from "@/lib/classes";

const priceFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

/**
 * Formats a numeric PKR amount, e.g. 8500 -> "Rs 8,500".
 */
export function formatPrice(amount: number): string {
  return `Rs ${priceFormatter.format(amount)}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
