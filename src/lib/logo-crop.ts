/**
 * Crop tuning for `public/bayt-logo.png` — circular emblem sits in the upper
 * centre of a square PNG with wide black margins below.
 */
export const LOGO_CROP = {
  /** Circle centre as a fraction of the source image (0–1). */
  centerX: 0.5,
  centerY: 0.265,
  /** Circle diameter as a fraction of the source image width. */
  diameter: 0.5,
} as const;

/** Pixel layout for favicon / apple-icon ImageResponse generation. */
export function logoIconLayout(box: number) {
  const imgSize = Math.round(box / LOGO_CROP.diameter);
  return {
    box,
    imgSize,
    left: box / 2 - LOGO_CROP.centerX * imgSize,
    top: box / 2 - LOGO_CROP.centerY * imgSize,
  };
}

/** Tailwind zoom % so the circular emblem fills a rounded clip box. */
export const LOGO_MARK_ZOOM = `${Math.round((1 / LOGO_CROP.diameter) * 100)}%`;

/** Vertical anchor (% from top of source) aligned to the circle centre. */
export const LOGO_MARK_TOP = `${LOGO_CROP.centerY * 100}%`;
