import type { Metadata } from "next";
import { SEO, SITE } from "@/constants/site";

/** Canonical, env-aware site origin. Use everywhere absolute URLs are built. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;

export const OG_IMAGE = {
  url: "/og-default.jpg",
  width: 1200,
  height: 630,
  alt: SITE.name,
};

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SEO.title,
    template: `%s | ${SITE.shortName}`,
  },
  description: SEO.description,
  keywords: [...SEO.keywords],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: siteUrl,
    siteName: SITE.name,
    title: SEO.title,
    description: SEO.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
    images: [OG_IMAGE.url],
  },
  category: "Medical Equipment",
  icons: {
    icon: [
      { url: SITE.favicon, sizes: "32x32" },
      { url: SITE.faviconPng, sizes: "512x512", type: "image/png" },
    ],
    shortcut: SITE.favicon,
    apple: SITE.faviconPng,
  },
};
