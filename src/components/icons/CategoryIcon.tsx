import { Box, Droplets, Package, Wrench, type LucideIcon } from "lucide-react";

interface CategoryIconProps {
  iconId: string;
}

const ICONS: Record<string, LucideIcon> = {
  cups: Droplets,
  kits: Box,
  accessories: Wrench,
  consumables: Package,
};

export default function CategoryIcon({ iconId }: CategoryIconProps) {
  const Icon = ICONS[iconId] ?? Droplets;
  return <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} aria-hidden="true" />;
}
