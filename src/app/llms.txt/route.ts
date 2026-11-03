import { FAQ_ITEMS } from "@/constants/testimonials";
import { SITE } from "@/constants/site";
import { siteUrl } from "@/lib/metadata";
import { getCategories, getProducts } from "@/lib/products";
import { formatPrice } from "@/utils";

export const revalidate = 3600;

export async function GET() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ sort: "name" }),
  ]);

  const categoryLines =
    categories.length > 0
      ? categories
          .map(
            (category) =>
              `- [${category.name}](${siteUrl}/shop/category/${category.slug}): ${category.description || "Hijama equipment in this category."}`,
          )
          .join("\n")
      : "- [Shop](" + siteUrl + "/shop): Full Hijama equipment catalog.";

  const productLines = products
    .map((product) => {
      const blurb = product.description.replace(/\s+/g, " ").trim();
      return `- [${product.name}](${siteUrl}/shop/${product.slug}): ${formatPrice(product.price)}. ${blurb}`;
    })
    .join("\n");

  const faqLines = FAQ_ITEMS.map(
    (item) => `### ${item.question}\n\n${item.answer}`,
  ).join("\n\n");

  const body = `# ${SITE.name}

> ${SITE.name} sells Hijama cups, vacuum pumps, therapy tools, and clinic consumables from Lahore, with delivery across Pakistan. The only public website is ${siteUrl}.

## Contact

- Location: ${SITE.location}
- Delivery: ${SITE.delivery}
- Phone and WhatsApp: ${SITE.phone}
- Email: ${SITE.email}

## Pages

- [Home](${siteUrl}/): Overview of the supplier, featured products, and common questions.
- [Shop](${siteUrl}/shop): Full product catalog with prices in PKR.
- [About](${siteUrl}/about): Who the shop supplies — therapists, clinics, institutes, students, and wellness centers.
- [Delivery and payment](${siteUrl}/delivery): Nationwide delivery. Shipping is confirmed after the order and is not included in the product price. Payment by cash on delivery, bank transfer, JazzCash, or Easypaisa.
- [FAQ](${siteUrl}/faq): Ordering, shipping, and payment answers.
- [Contact](${siteUrl}/contact): Phone, WhatsApp, email, and social profiles.

## Categories

${categoryLines}

## Products

${productLines || "- Product listings are published in the shop."}

## FAQ

${faqLines}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
