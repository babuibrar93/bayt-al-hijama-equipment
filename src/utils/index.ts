export function scrollToSection(hash: string, offset = 80): void {
  const target = document.querySelector(hash);
  if (!target) return;

  const top =
    target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getBadgeClass(
  variant: "default" | "new" | "gold",
): string {
  switch (variant) {
    case "new":
      return "product-card__badge product-card__badge--new";
    case "gold":
      return "product-card__badge product-card__badge--gold";
    default:
      return "product-card__badge";
  }
}

export function getRevealClass(
  variant: "up" | "left" | "right",
  delay?: 1 | 2 | 3 | 4,
): string {
  const base =
    variant === "left"
      ? "reveal-left"
      : variant === "right"
        ? "reveal-right"
        : "reveal-up";

  return delay ? `${base} delay-${delay}` : base;
}
