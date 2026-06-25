import { SITE, SEO } from "@/constants/site";
import { FAQ_ITEMS } from "@/constants/testimonials";
import { siteUrl } from "@/lib/metadata";
import type { ProductWithCategory } from "@/types/db";

const SITE_URL = siteUrl;

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    url: SITE_URL,
    logo: `${SITE_URL}${SITE.logo.src}`,
    image: `${SITE_URL}/og-default.jpg`,
    description: SEO.description,
    telephone: SITE.phoneRaw,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    areaServed: {
      "@type": "Country",
      name: "Pakistan",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phoneRaw,
      contactType: "customer service",
      availableLanguage: ["English", "Urdu"],
      areaServed: "PK",
    },
    sameAs: [`https://wa.me/${SITE.whatsappNumber}`],
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE.name,
    description: SEO.description,
    url: SITE_URL,
    logo: `${SITE_URL}${SITE.logo.src}`,
    image: `${SITE_URL}/og-default.jpg`,
    telephone: SITE.phoneRaw,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.5204,
      longitude: 74.3587,
    },
    areaServed: {
      "@type": "Country",
      name: "Pakistan",
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE.name,
    url: SITE_URL,
    description: SEO.description,
    inLanguage: "en-PK",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** WebPage schema for a specific page (home, category, etc.). */
export function getWebPageSchema(params: {
  path: string;
  name: string;
  description: string;
}) {
  const url = `${SITE_URL}${params.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: params.name,
    description: params.description,
    inLanguage: "en-PK",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
  };
}

export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Global, site-wide schemas. Mounted on the homepage only (not on every
 * route) to avoid emitting Organization/FAQ data on cart, checkout, etc.
 * The FAQ schema requires the matching visible FAQ section on the homepage.
 */
export function getHomeStructuredData() {
  return [
    getOrganizationSchema(),
    getLocalBusinessSchema(),
    getWebSiteSchema(),
    getWebPageSchema({
      path: "/",
      name: SEO.title,
      description: SEO.description,
    }),
    getFaqSchema(),
  ];
}

/** Product + Offer schema for an individual product detail page. */
export function getProductSchema(product: ProductWithCategory) {
  const url = `${SITE_URL}/shop/${product.slug}`;
  const images = product.images.length > 0 ? product.images : undefined;
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    ...(images ? { image: images } : {}),
    sku: product.slug,
    mpn: product.slug,
    ...(product.features.length > 0
      ? { keywords: product.features.join(", ") }
      : {}),
    ...(product.category?.name ? { category: product.category.name } : {}),
    brand: {
      "@type": "Brand",
      name: SITE.name,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "PKR",
      price: product.price,
      priceValidUntil,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  };
}

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

/** BreadcrumbList schema. Pass paths relative to the site root. */
export function getBreadcrumbSchema(entries: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: `${SITE_URL}${entry.path}`,
    })),
  };
}

/** ItemList schema for the shop collection / category pages. */
export function getShopItemListSchema(
  products: ProductWithCategory[],
  listName = "Hijama Equipment Products",
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/shop/${product.slug}`,
      name: product.name,
    })),
  };
}
