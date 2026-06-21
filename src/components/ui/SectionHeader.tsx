import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  eyebrowClass?: string;
  titleClass?: string;
  subtitleClass?: string;
  subtitleDelay?: 1 | 2 | 3 | 4;
  titleDelay?: 1 | 2 | 3 | 4;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  eyebrowClass = "reveal-up",
  titleClass = "section-title reveal-up delay-1",
  subtitleClass = "section-sub reveal-up delay-2",
}: SectionHeaderProps) {
  return (
    <>
      <div className={`section-eyebrow ${eyebrowClass}`}>{eyebrow}</div>
      <h2 className={titleClass}>{title}</h2>
      {subtitle ? <p className={subtitleClass}>{subtitle}</p> : null}
    </>
  );
}
