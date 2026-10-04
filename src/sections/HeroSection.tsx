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
  typeBody,
  typeDisplay,
  typeEyebrow,
} from "@/lib/classes";

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className={cn(
        "relative flex min-h-[90svh] items-center overflow-hidden bg-black pb-8 pt-[92px] lg:min-h-svh lg:pb-10 lg:pt-[96px]",
        pageGutter,
      )}
    >
      <Image
        src="/hero-hijama.jpg"
        alt="Professional Hijama cupping equipment"
        fill
        priority
        quality={62}
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

      <IdleParticles id="heroParticles" options={{ count: 10, goldRatio: 0.35 }} />

      <div className="relative z-[2] w-full max-w-[620px] max-md:mx-auto max-md:text-center">
        <div
          data-reveal
          className={cn(
            "mb-5 flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 font-medium uppercase tracking-[0.12em] text-gold sm:tracking-[0.15em] lg:justify-start is-visible",
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
            "mb-5 font-display font-normal leading-[0.95] tracking-[-0.01em] text-white is-visible",
            typeDisplay,
            getRevealClass("up", 1),
          )}
        >
          <span className="block leading-[0.88]">
            Elevate Your <br />
            <span className="-mt-1 block text-transparent [-webkit-text-stroke:1px_#c9a84c]">
              Hijama Practice
            </span>
          </span>
          <span className="block italic leading-[0.95] text-white/70">
            With Professional <br /> Grade Equipment
          </span>
        </h1>

        <p
          data-reveal
          className={cn(
            "mb-8 max-w-[500px] leading-[1.7] text-white/70 max-md:mx-auto is-visible",
            typeBody,
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
    </section>
  );
}
