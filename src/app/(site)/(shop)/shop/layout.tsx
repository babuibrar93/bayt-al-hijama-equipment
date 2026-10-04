import type { Metadata } from "next";

const SHOP_DESCRIPTION =
  "Browse premium Hijama equipment online. Hijama cups, complete kits, pumps, and consumables with nationwide delivery across Pakistan.";

/** In the static shell so crawlers see a description before streamed page metadata. */
export const metadata: Metadata = {
  description: SHOP_DESCRIPTION,
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
