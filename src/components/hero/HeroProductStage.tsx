"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HijamaCupIllustration from "@/components/hero/HijamaCupIllustration";
import HijamaPumpIllustration from "@/components/hero/HijamaPumpIllustration";
import { cn } from "@/lib/classes";

export type StageItemType = "cup" | "pump";

export interface StageItem {
  type: StageItemType;
  size?: "sm" | "md" | "lg";
  valveColor?: "green" | "gold";
  imageSrc?: string;
  imageAlt?: string;
  label?: string;
}

interface HeroProductStageProps {
  items: StageItem[];
}

const CUP_SIZE = {
  sm: "h-[64px] w-[76px]",
  md: "h-[76px] w-[90px]",
  lg: "h-[148px] w-[172px]",
} as const;

const COMPANION_META = [
  { label: "No. 5", sub: "Medium cup" },
  { label: "Vacuum Pump", sub: "Pistol grip" },
  { label: "No. 3", sub: "Small cup" },
] as const;

function StageAsset({
  item,
  index,
  sizeOverride,
}: {
  item: StageItem;
  index: number;
  sizeOverride?: "sm" | "md" | "lg";
}) {
  if (item.type === "pump") {
    return (
      <div className="h-[56px] w-[72px] max-md:h-[48px] max-md:w-[62px]">
        <HijamaPumpIllustration idSuffix={`s${index}`} />
      </div>
    );
  }

  const size = sizeOverride ?? item.size ?? "md";
  return (
    <div className={cn("relative", CUP_SIZE[size])}>
      {item.imageSrc ? (
        <Image
          src={item.imageSrc}
          alt={item.imageAlt ?? "Hijama cup"}
          fill
          sizes={size === "lg" ? "200px" : "90px"}
          priority={size === "lg"}
          className="object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.5)]"
        />
      ) : (
        <HijamaCupIllustration
          idSuffix={`s${index}`}
          valveColor={item.valveColor ?? "green"}
          className="drop-shadow-[0_16px_32px_rgba(0,0,0,0.5)]"
        />
      )}
    </div>
  );
}

export default function HeroProductStage({ items }: HeroProductStageProps) {
  const heroItem = items[0];
  const companions = items.slice(1, 4);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(
      () => setActive((prev) => (prev + 1) % Math.max(companions.length, 1)),
      2800,
    );
    return () => clearInterval(timer);
  }, [companions.length]);

  return (
    <div
      data-hero-visual
      aria-hidden="true"
      className="relative z-[2] w-full max-w-[540px] lg:max-w-none"
    >
      {/* card shell with animated border */}
      <div className="relative overflow-hidden rounded-2xl p-px">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[100%] motion-reduce:animate-none animate-border-spin opacity-40"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, rgba(201,168,76,0.5), transparent, rgba(46,155,106,0.4), transparent)",
          }}
        />

        <div className="relative overflow-hidden rounded-2xl border border-glass-border bg-black-2">
          {/* inner ambience */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-green-mid/10 blur-3xl"
          />

          <div className="relative flex min-h-[440px] flex-col p-6 max-md:min-h-[380px] max-md:p-5">
            {/* header */}
            <div className="mb-5">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-gold/70">
                Professional Kit
              </p>
            </div>

            {/* hero product zone — fills available space */}
            <div className="relative flex flex-1 flex-col items-center justify-center py-2">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-1/2 h-[180px] -translate-y-1/2 rounded-full bg-cup-glow opacity-80"
              />

              {/* pedestal */}
              <div className="pointer-events-none absolute bottom-[18%] left-1/2 h-3 w-[46%] -translate-x-1/2 rounded-[50%] border border-gold/15 bg-gradient-to-b from-white/[0.08] to-transparent" />
              <div className="pointer-events-none absolute bottom-[16%] left-1/2 h-5 w-[28%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-[3px]" />

              {heroItem ? (
                <div className="relative z-10 flex flex-col items-center">
                  <StageAsset item={heroItem} index={0} sizeOverride="lg" />
                </div>
              ) : null}

              {/* slow spotlight sweep */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
              >
                <div className="absolute inset-y-0 w-1/3 motion-reduce:animate-none animate-logo-beam bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
              </div>
            </div>

            {/* companion row */}
            <div className="mt-auto border-t border-glass-border pt-5">
              <div className="grid grid-cols-3 gap-3 max-md:gap-2">
                {companions.map((item, i) => {
                  const meta = COMPANION_META[i];
                  const isActive = active === i;

                  return (
                    <button
                      key={i}
                      type="button"
                      tabIndex={-1}
                      aria-hidden="true"
                      className={cn(
                        "relative flex flex-col items-center rounded-xl border px-2 py-3 transition-all duration-500 ease-out max-md:py-2.5",
                        isActive
                          ? "scale-[1.03] border-green-mid/35 bg-green-mid/10 shadow-[0_0_24px_rgba(46,155,106,0.12)]"
                          : "scale-[0.97] border-transparent bg-white/[0.02] opacity-55",
                      )}
                    >
                      <StageAsset item={item} index={i + 1} />
                      <span
                        className={cn(
                          "mt-2 text-[0.58rem] font-medium uppercase tracking-[0.16em] transition-colors duration-500 max-md:text-[0.52rem]",
                          isActive ? "text-green-light" : "text-white/35",
                        )}
                      >
                        {item.label ?? meta?.label}
                      </span>
                      {meta?.sub ? (
                        <span className="mt-0.5 text-[0.55rem] text-white/25 max-md:hidden">
                          {meta.sub}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* progress dots */}
              <div className="mt-4 flex justify-center gap-1.5">
                {companions.map((_, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      active === i ? "w-5 bg-green-light" : "w-1 bg-white/20",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
