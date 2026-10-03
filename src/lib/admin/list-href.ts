/** Build a list URL preserving current filters while updating page / perPage. */
export function buildListHref(
  pathname: string,
  current: Record<string, string | undefined>,
  updates: { page?: number; perPage?: number },
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    if (!value || key === "page" || key === "perPage") continue;
    params.set(key, value);
  }
  const page = updates.page ?? 1;
  const perPage = updates.perPage;
  if (page > 1) params.set("page", String(page));
  if (perPage != null) params.set("perPage", String(perPage));
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function parsePage(value: string | undefined, fallback = 1): number {
  const n = Number(value || fallback);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : fallback;
}

export const ADMIN_PAGE_SIZE = 10;

export function parsePerPage(
  value: string | undefined,
  fallback = ADMIN_PAGE_SIZE,
  allowed: number[] = [10, 20, 50],
): number {
  const n = Number(value || fallback);
  if (allowed.includes(n)) return n;
  return fallback;
}
