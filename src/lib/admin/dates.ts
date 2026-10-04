/** Asia/Karachi day/month bounds as UTC ISO strings for Supabase filters. */

const KARACHI_OFFSET_MS = 5 * 60 * 60 * 1000;

function karachiParts(date = new Date()) {
  const shifted = new Date(date.getTime() + KARACHI_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

/** Start of Karachi calendar day → UTC ISO */
export function karachiDayStartIso(yyyyMmDd: string): string {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d, 0, 0, 0) - KARACHI_OFFSET_MS;
  return new Date(utc).toISOString();
}

/** End of Karachi calendar day (exclusive next day) → UTC ISO */
export function karachiDayEndExclusiveIso(yyyyMmDd: string): string {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d + 1, 0, 0, 0) - KARACHI_OFFSET_MS;
  return new Date(utc).toISOString();
}

export function karachiMonthBounds(year: number, month: number): {
  from: string;
  to: string;
} {
  const from = Date.UTC(year, month - 1, 1, 0, 0, 0) - KARACHI_OFFSET_MS;
  const to = Date.UTC(year, month, 1, 0, 0, 0) - KARACHI_OFFSET_MS;
  return {
    from: new Date(from).toISOString(),
    to: new Date(to).toISOString(),
  };
}

export function karachiYearBounds(year: number): { from: string; to: string } {
  const from = Date.UTC(year, 0, 1, 0, 0, 0) - KARACHI_OFFSET_MS;
  const to = Date.UTC(year + 1, 0, 1, 0, 0, 0) - KARACHI_OFFSET_MS;
  return {
    from: new Date(from).toISOString(),
    to: new Date(to).toISOString(),
  };
}

export function currentKarachiYearMonth(): { year: number; month: number } {
  const { year, month } = karachiParts();
  return { year, month };
}

/** Calendar date key (YYYY-MM-DD) for “now” in Asia/Karachi. */
export function currentKarachiDateKey(date = new Date()): string {
  const { year, month, day } = karachiParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${padDay(day)}`;
}

/**
 * Build a timestamptz ISO for a Karachi calendar day, keeping the clock time
 * from `from` (also interpreted in Karachi). Used when admin sets order date.
 */
export function karachiDateWithTimeIso(
  yyyyMmDd: string,
  from = new Date(),
): string {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const shifted = new Date(from.getTime() + KARACHI_OFFSET_MS);
  const hh = shifted.getUTCHours();
  const mm = shifted.getUTCMinutes();
  const ss = shifted.getUTCSeconds();
  const ms = shifted.getUTCMilliseconds();
  const utc =
    Date.UTC(y, m - 1, d, hh, mm, ss, ms) - KARACHI_OFFSET_MS;
  return new Date(utc).toISOString();
}

export function monthLabel(month: number): string {
  return new Date(Date.UTC(2000, month - 1, 1)).toLocaleString("en", {
    month: "short",
    timeZone: "UTC",
  });
}

export function monthLabelLong(month: number): string {
  return new Date(Date.UTC(2000, month - 1, 1)).toLocaleString("en", {
    month: "long",
    timeZone: "UTC",
  });
}

/** Calendar date key (YYYY-MM-DD) in Asia/Karachi for an ISO timestamp. */
export function toKarachiDateKey(iso: string): string {
  const shifted = new Date(new Date(iso).getTime() + KARACHI_OFFSET_MS);
  const y = shifted.getUTCFullYear();
  const m = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const d = String(shifted.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function daysInKarachiMonth(year: number, month: number): number {
  // Day 0 of next month = last day of this month (UTC calendar matches Karachi Y-M-D keys)
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function karachiDayKeysInMonth(year: number, month: number): string[] {
  const count = daysInKarachiMonth(year, month);
  const mm = String(month).padStart(2, "0");
  return Array.from({ length: count }, (_, i) => {
    const dd = String(i + 1).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  });
}

export function formatKarachiDayLabel(yyyyMmDd: string): string {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleString("en", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function padDay(day: number): string {
  return String(day).padStart(2, "0");
}
