import { SITE, SEO } from "@/constants/site";
import { FAQ_ITEMS } from "@/constants/testimonials";
import { PRODUCTS } from "@/constants/products";
import type { ProductWithCategory } from "@/types/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    description: SEO.description,
    telephone: SITE.phoneRaw,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
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
    name: SITE.name,
    description: SEO.description,
    url: SITE.url,
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
    name: SITE.name,
    url: SITE.url,
    description: SEO.description,
    inLanguage: "en-PK",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
    },
  };
}

export function getProductListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hijama Equipment Products",
    itemListElement: PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        description: product.description,
        brand: {
          "@type": "Brand",
          name: SITE.name,
        },
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "PKR",
          seller: {
            "@type": "Organization",
            name: SITE.name,
          },
        },
      },
    })),
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

export function getStructuredData() {
  return [
    getOrganizationSchema(),
    getLocalBusinessSchema(),
    getWebSiteSchema(),
    getProductListSchema(),
    getFaqSchema(),
  ];
}

/** Product + Offer schema for an individual product detail page. */
export function getProductSchema(product: ProductWithCategory) {
  const image = product.images[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    ...(image ? { image: [image] } : {}),
    sku: product.id,
    category: product.category?.name,
    brand: {
      "@type": "Brand",
      name: SITE.name,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${product.slug}`,
      priceCurrency: "PKR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE.name,
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
