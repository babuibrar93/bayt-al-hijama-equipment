import { Cormorant_Garamond, Inter, Noto_Nastaliq_Urdu } from "next/font/google";

/** Variable font: one file covers the weights used across the storefront. */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Hero display face only — keep the download to the two styles actually used. */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

/**
 * Footer Arabic line only. Not preloaded so it never competes with the hero.
 * The class is applied once the footer is near the viewport.
 */
export const notoUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-noto-urdu",
  display: "optional",
  weight: "400",
  preload: false,
  adjustFontFallback: true,
  fallback: ["serif"],
});

export const fontVariables = `${inter.variable} ${cormorant.variable} ${notoUrdu.variable}`;
