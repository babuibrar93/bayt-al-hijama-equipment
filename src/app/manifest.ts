import type { MetadataRoute } from "next";
import { SITE, SEO } from "@/constants/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SEO.description,
    start_url: "/",
    display: "standalone",
    background_color: "#050c08",
    theme_color: "#050c08",
    lang: "en",
    categories: ["shopping", "medical"],
    icons: [
      {
        src: SITE.faviconPng,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: SITE.faviconPng,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
