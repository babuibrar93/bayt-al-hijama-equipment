import type { ReactNode } from "react";
import { cn, sectionEyebrow, sectionSub, sectionTitle } from "@/lib/classes";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  eyebrowClass?: string;
  titleClass?: string;
  subtitleClass?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  eyebrowClass,
  titleClass,
  subtitleClass,
}: SectionHeaderProps) {
  return (
    <>
      <div data-reveal className={cn(sectionEyebrow, eyebrowClass)}>
        {eyebrow}
      </div>
      <h2 data-reveal className={cn(sectionTitle, "delay-100", titleClass)}>
        {title}
      </h2>
      {subtitle ? (
        <p data-reveal className={cn(sectionSub, "delay-200", subtitleClass)}>
          {subtitle}
        </p>
      ) : null}
    </>
  );
}
