import {
  Headphones,
  ShieldCheck,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";

interface TrustIconProps {
  iconId: string;
}

const ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  delivery: Truck,
  support: Headphones,
  community: Users,
};

export default function TrustIcon({ iconId }: TrustIconProps) {
  const Icon = ICONS[iconId] ?? ShieldCheck;
  return <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} aria-hidden="true" />;
}
