import { getHomeStructuredData } from "@/lib/structured-data";

/**
 * Site-wide JSON-LD (Organization, LocalBusiness, WebSite, WebPage, FAQ).
 * Mounted on the homepage only — its FAQ schema is backed by the visible
 * FAQ section on the home page.
 */
export default function StructuredData() {
  const schemas = getHomeStructuredData();

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`${String(schema["@type"])}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
