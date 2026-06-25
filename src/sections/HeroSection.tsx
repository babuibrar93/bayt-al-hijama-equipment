import { Fragment } from "react";
import Particles from "@/components/ui/Particles";
import CounterStat from "@/components/ui/CounterStat";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import HeroVisual from "@/components/hero/HeroVisual";
import { HERO_STATS } from "@/constants/site";
import { WHATSAPP } from "@/constants/whatsapp";
import { btnGhost, btnPrimary, cn, getRevealClass } from "@/lib/classes";

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative grid min-h-[90svh] grid-cols-1 items-center gap-8 overflow-hidden bg-black px-[60px] pb-14 pt-[96px] before:pointer-events-none before:absolute before:inset-0 before:bg-grad-hero max-md:px-8 max-md:pb-12 max-md:pt-[92px] max-md:text-center lg:min-h-svh lg:grid-cols-2 lg:gap-10 lg:pb-20"
    >
      <Particles id="heroParticles" options={{ count: 40, goldRatio: 0.4 }} />

      <div
        aria-hidden="true"
        className="hero-grid-mask pointer-events-none absolute inset-0 bg-hero-grid bg-[length:60px_60px]"
      />

      <div className="relative z-[2] max-w-[620px] max-md:max-w-full">
        <div
          data-reveal
          className={cn(
            "mb-5 inline-flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.15em] text-gold max-md:justify-center is-visible",
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
          <span className="block font-light italic text-white/60">
            With Professional <br /> Grade Equipment
          </span>
        </h1>

        <p
          data-reveal
          className={cn(
            "mb-8 max-w-[500px] text-[1rem] leading-[1.7] text-white/60 max-md:mx-auto is-visible",
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
            className={btnPrimary}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex shrink-0">
              <WhatsAppIcon />
            </span>
            Order on WhatsApp
          </a>
          <a href="#products" data-magnetic className={btnGhost}>
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
            "flex items-center border-t border-glass-border py-4 max-md:justify-center is-visible",
            getRevealClass("up", 4),
          )}
        >
          {HERO_STATS.map((stat, index) => (
            <Fragment key={stat.label}>
              {index > 0 ? (
                <div
                  className="h-12 w-px shrink-0 bg-glass-border"
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

      <HeroVisual />

      <div
        aria-hidden="true"
        className="absolute bottom-10 left-[60px] z-[2] flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.15em] text-white/30 max-md:hidden"
      >
        <span>Scroll</span>
        <div className="relative h-px w-10 overflow-hidden bg-white/30 after:absolute after:inset-0 after:animate-scroll-line after:bg-gold" />
      </div>
    </section>
  );
}
