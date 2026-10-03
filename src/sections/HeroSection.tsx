import Image from "next/image";
import { Fragment } from "react";
import Particles from "@/components/ui/Particles";
import CounterStat from "@/components/ui/CounterStat";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { HERO_STATS } from "@/constants/site";
import { WHATSAPP } from "@/constants/whatsapp";
import { btnGhost, btnPrimary, cn, getRevealClass } from "@/lib/classes";

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative flex min-h-[90svh] items-center overflow-hidden bg-black px-4 pb-14 pt-[92px] sm:px-6 md:px-8 lg:min-h-svh lg:px-10 lg:pb-20 lg:pt-[96px] xl:px-[60px]"
    >
      <Image
        src="/hero-hijama.jpg"
        alt="Professional Hijama cupping equipment"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center] sm:object-[72%_center]"
      />

      {/* Keep cups/pump visible on the right; darken left for copy */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/35 sm:via-black/80 sm:to-black/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grad-hero opacity-70"
      />

      <Particles id="heroParticles" options={{ count: 24, goldRatio: 0.35 }} />

      <div className="relative z-[2] w-full max-w-[620px] max-md:mx-auto max-md:text-center">
        <div
          data-reveal
          className={cn(
            "mb-5 flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-gold sm:text-[0.75rem] sm:tracking-[0.15em] lg:justify-start is-visible",
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
            "mb-5 font-display text-[clamp(2.5rem,4.5vw,4.5rem)] font-normal leading-[1.08] tracking-[-0.01em] text-white is-visible",
            getRevealClass("up", 1),
          )}
        >
          <span className="block">
            Elevate Your <br />
            <span className="text-transparent [-webkit-text-stroke:1px_#c9a84c]">
              Hijama Practice
            </span>
          </span>
          <span className="block font-light italic text-white/70">
            With Professional <br /> Grade Equipment
          </span>
        </h1>

        <p
          data-reveal
          className={cn(
            "mb-8 max-w-[500px] text-[1rem] leading-[1.7] text-white/70 max-md:mx-auto is-visible",
            getRevealClass("up", 2),
          )}
        >
          Trusted by 500+ therapists, clinics, and training institutes across
          Pakistan. Premium quality tools that honour the Sunnah — delivered to
          your door.
        </p>

        <div
          data-reveal
          className={cn(
            "mb-10 flex flex-wrap items-center gap-4 max-md:justify-center is-visible",
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
            "flex flex-wrap items-center justify-center gap-x-4 gap-y-3 border-t border-glass-border py-4 max-md:gap-x-2 lg:justify-start is-visible",
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

      <div
        aria-hidden="true"
        className="absolute bottom-10 left-4 z-[2] flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.15em] text-white/30 sm:left-6 md:left-8 lg:left-10 xl:left-[60px] max-md:hidden"
      >
        <span>Scroll</span>
        <div className="relative h-px w-10 overflow-hidden bg-white/30 after:absolute after:inset-0 after:animate-scroll-line after:bg-gold" />
      </div>
    </section>
  );
}
