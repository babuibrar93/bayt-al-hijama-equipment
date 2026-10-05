export const SITE = {
  name: "Bayt Al Hijama Equipment",
  shortName: "Bayt Al Hijama",
  tagline: "Equipment",
  logo: {
    src: "/bayt-logo.png",
    alt: "Bayt Al Hijama",
    width: 256,
    height: 256,
  },
  favicon: "/favicon.ico",
  /** Cropped from bayt-logo.png — emblem fills the frame (favicon only). */
  faviconPng: "/favicon.png",
  url: "https://baytalhijama.com",
  locale: "en_PK",
  email: "info@baytalhijama.com",
  phone: "+92 329 3561309",
  phoneRaw: "+923293561309",
  whatsappNumber: "923293561309",
  location: "Lahore, Pakistan",
  delivery: "All Over Pakistan",
  copyright: "© 2025 Bayt Al Hijama Equipment. All rights reserved.",
  arabicName: "بَيْتُ الْحِجَامَة",
} as const;

/** Copy used on customer-facing invoice PDFs. */
export const INVOICE_COPY = {
  terms:
    "Damage to goods during transportation and travelling or cargo, courier bookings, etc. will be the responsibility of the customer.",
  payByQr: "Pay your bill by scanning the QR code below.",
  thanks: "THANKS FOR BUYING THE PRODUCT OF BAYT AL HIJAMA EQUIPMENT",
} as const;

export const SEO = {
  title: "Bayt Al Hijama Equipment | Premium Hijama Equipment Supplier in Pakistan",
  description:
    "Professional Hijama Equipment Supplier in Pakistan. Premium Hijama Cups, Complete Kits, Accessories, and Nationwide Delivery.",
  keywords: [
    "Hijama Equipment",
    "Hijama Cups",
    "Hijama Kits Pakistan",
    "Cupping Therapy Equipment",
    "Hijama Supplier Pakistan",
    "Bayt Al Hijama",
  ],
} as const;

export const HERO_STATS = [
  { target: 1000, suffix: "+", label: "Happy Therapists" },
  { target: 50, suffix: "+", label: "Cities Served" },
  { target: 3, suffix: " Days", label: "Avg Delivery" },
] as const;
