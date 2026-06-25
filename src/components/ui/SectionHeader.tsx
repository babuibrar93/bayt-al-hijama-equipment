import type { ReactNode } from "react";
import { cn, sectionEyebrow, sectionSub, sectionTitle } from "@/lib/classes";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle: string;
  centered?: boolean;
  eyebrowClass?: string;
  titleClass?: string;
  subtitleClass?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  eyebrowClass,
  titleClass,
  subtitleClass,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered && "text-center")}>
      {eyebrow ? (
        <div
          data-reveal
          className={cn(
            sectionEyebrow,
            centered && "mx-auto",
            eyebrowClass,
          )}
        >
          {eyebrow}
        </div>
      ) : null}
      <h2
        data-reveal
        className={cn(sectionTitle, "delay-100", titleClass)}
      >
        {title}
      </h2>
      <p
        data-reveal
        className={cn(sectionSub, "delay-200", subtitleClass)}
      >
        {subtitle}
      </p>
    </div>
  );
}
