import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

const SITE_URL = siteUrl;

const PRIVATE_PATHS = [
  "/admin",
  "/cart",
  "/checkout",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/account",
  "/api",
];

/**
 * One rule for every crawler: Googlebot, Bingbot (used by some AI search),
 * and the ChatGPT, Claude, and Gemini crawlers. Public pages stay allowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: PRIVATE_PATHS,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
