import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/cart",
        "/checkout",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/account",
        "/api",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
