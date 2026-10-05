import Image from "next/image";
import { Fragment } from "react";
import IdleParticles from "@/components/ui/IdleParticles";
import CounterStat from "@/components/ui/CounterStat";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { HERO_STATS } from "@/constants/site";
import { WHATSAPP } from "@/constants/whatsapp";
import {
  btnGhost,
  btnPrimary,
  cn,
  getRevealClass,
  pageGutter,
  typeEyebrow,
} from "@/lib/classes";

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className={cn(
        "relative flex min-h-[72svh] flex-col overflow-hidden bg-black",
        /* Always clear the fixed nav; never let vertical centering eat top space */
        "pb-8 pt-[calc(theme(spacing.nav)+1.25rem)]",
        "sm:min-h-[76svh] sm:pb-9 sm:pt-[calc(theme(spacing.nav)+1.75rem)]",
        "lg:min-h-[80svh] lg:pb-10 lg:pt-[calc(theme(spacing.nav)+2rem)]",
        pageGutter,
      )}
    >
      <Image
        src="/hero-hijama.jpg"
        alt="Professional Hijama cupping equipment"
        fill
        priority
        quality={75}
        sizes="100vw"
        className="object-cover object-[75%_32%] sm:object-[80%_28%] lg:object-[82%_30%]"
      />

      {/* Darken left for copy; keep bright product side visible on the right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent sm:via-black/85 sm:to-black/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grad-hero opacity-40"
      />

      <IdleParticles id="heroParticles" options={{ count: 10, goldRatio: 0.35 }} />

      {/* my-auto centers when space allows; top padding on section always remains */}
      <div className="relative z-[2] my-auto w-full max-w-[620px] max-md:mx-auto max-md:text-center">
        <div
          data-reveal
          className={cn(
            "mb-3 flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 font-medium uppercase tracking-[0.12em] text-gold sm:mb-4 sm:tracking-[0.15em] lg:mb-5 lg:justify-start is-visible",
            typeEyebrow,
            getRevealClass("up"),
          )}
        >
          <span
            className="h-1 w-1 shrink-0 rounded-full bg-gold"
            aria-hidden="true"
          />
          Pakistan&apos;s Most Trusted Hijama Equipment Supplier
          <span
            className="h-1 w-1 shrink-0 rounded-full bg-gold"
            aria-hidden="true"
          />
        </div>

        <h1
          data-reveal
          className={cn(
            "mb-3 font-display font-normal leading-[1.02] tracking-[-0.01em] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)] is-visible sm:mb-4",
            /* Cap size with rem + soft vw so 100% zoom on 13" stays balanced */
            "text-[clamp(1.85rem,1.15rem+1.6vw,2.75rem)]",
            "min-[1100px]:text-[clamp(2.1rem,1.2rem+1.5vw,3rem)]",
            /* Shorter laptop viewports (common at 100% zoom) */
            "max-[800px]:text-[clamp(1.75rem,1.1rem+1.4vw,2.35rem)]",
            getRevealClass("up", 1),
          )}
        >
          <span className="block leading-[1.02]">Elevate Your</span>
          <span className="block leading-[1.02] text-gold">Hijama Practice</span>
          <span className="block italic leading-[1.05] text-white/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
            With Professional Grade Equipment
          </span>
        </h1>

        <p
          data-reveal
          className={cn(
            "mb-5 max-w-[500px] text-[0.875rem] leading-[1.65] text-white/80 max-md:mx-auto is-visible drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)] sm:mb-6 sm:text-[0.95rem] sm:leading-[1.7] lg:mb-7",
            getRevealClass("up", 2),
          )}
        >
          Trusted by 1000+ therapists, clinics, and training institutes across
          Pakistan. Premium quality tools that honour the Sunnah — delivered to
          your door.
        </p>

        <div
          data-reveal
          className={cn(
            "mb-6 flex flex-wrap items-center gap-3 max-md:justify-center is-visible sm:mb-8 sm:gap-4 lg:mb-10",
            getRevealClass("up", 3),
          )}
        >
          <a
            href={WHATSAPP.hero}
            data-magnetic
            className={cn(btnPrimary, "max-md:w-full max-md:justify-center")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex shrink-0">
              <WhatsAppIcon />
            </span>
            Order on WhatsApp
          </a>
          <a
            href="#products"
            data-magnetic
            className={cn(btnGhost, "max-md:w-full max-md:justify-center")}
          >
            Explore Products
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </a>
        </div>

        <div
          data-reveal
          className={cn(
            "flex flex-wrap items-center justify-center gap-x-4 gap-y-3 border-t border-glass-border py-3 max-md:gap-x-2 sm:py-4 lg:justify-start is-visible",
            getRevealClass("up", 4),
          )}
        >
          {HERO_STATS.map((stat, index) => (
            <Fragment key={stat.label}>
              {index > 0 ? (
                <div
                  className="hidden h-12 w-px shrink-0 bg-glass-border sm:block"
                  aria-hidden="true"
                />
              ) : null}
              <CounterStat
                target={stat.target}
                suffix={stat.suffix}
                label={stat.label}
              />
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
