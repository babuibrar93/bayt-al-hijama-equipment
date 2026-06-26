import HeroProductStage, { type StageItem } from "@/components/hero/HeroProductStage";

const HERO_ITEMS: StageItem[] = [
  { type: "cup", size: "lg", valveColor: "green" },
  { type: "cup", size: "md", valveColor: "gold", label: "No. 5" },
  { type: "pump", label: "Vacuum Pump" },
  { type: "cup", size: "sm", valveColor: "green", label: "No. 3" },
];

export default function HeroVisual() {
  return (
    <div className="relative z-[2] flex w-full items-center justify-center lg:justify-end">
      <HeroProductStage items={HERO_ITEMS} />
    </div>
  );
}
