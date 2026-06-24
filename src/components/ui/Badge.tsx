import { cn } from "@/lib/classes";

export type BadgeTone =
  | "neutral"
  | "green"
  | "gold"
  | "amber"
  | "blue"
  | "indigo"
  | "red";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-white/10 text-white/60",
  green: "bg-green-mid/20 text-green-light",
  gold: "bg-gold/15 text-gold",
  amber: "bg-amber-500/15 text-amber-300",
  blue: "bg-blue-500/15 text-blue-300",
  indigo: "bg-indigo-500/15 text-indigo-300",
  red: "bg-red-500/15 text-red-300",
};

interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
