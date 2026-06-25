import HeroProductStage, { type StageItem } from "@/components/hero/HeroProductStage";
import { getProducts } from "@/lib/products";

const DEFAULT_ITEMS: StageItem[] = [
  { type: "cup", size: "lg", valveColor: "green" },
  { type: "cup", size: "md", valveColor: "gold", label: "No. 5" },
  { type: "pump", label: "Vacuum Pump" },
  { type: "cup", size: "sm", valveColor: "green", label: "No. 3" },
];

export default async function HeroVisual() {
  const products = await getProducts({ featuredOnly: true, limit: 4 });
  const productImages = products
    .map((p) => ({ src: p.images[0], alt: p.name }))
    .filter((p): p is { src: string; alt: string } => Boolean(p.src));

  let imageIndex = 0;
  const items: StageItem[] = DEFAULT_ITEMS.map((item) => {
    if (item.type !== "cup" || !productImages[imageIndex]) return item;
    const mapped = {
      ...item,
      imageSrc: productImages[imageIndex].src,
      imageAlt: productImages[imageIndex].alt,
    };
    imageIndex += 1;
    return mapped;
  });

  return (
    <div className="relative z-[2] flex w-full items-center justify-center lg:justify-end">
      <HeroProductStage items={items} />
    </div>
  );
}
