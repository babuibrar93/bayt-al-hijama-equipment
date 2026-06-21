import { Fragment } from "react";
import Particles from "@/components/ui/Particles";
import CounterStat from "@/components/ui/CounterStat";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { HERO_STATS } from "@/constants/site";
import { WHATSAPP } from "@/constants/whatsapp";
import {
  btnGhost,
  btnPrimary,
  cn,
  getRevealClass,
} from "@/lib/classes";

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative grid min-h-svh grid-cols-1 items-center gap-10 overflow-hidden bg-black px-[60px] pb-20 pt-[136px] before:pointer-events-none before:absolute before:inset-0 before:bg-grad-hero max-md:px-8 max-md:pb-[60px] max-md:pt-[116px] max-md:text-center lg:grid-cols-2"
    >
      <Particles id="heroParticles" options={{ count: 40, goldRatio: 0.4 }} />

      <div
        aria-hidden="true"
        className="hero-grid-mask pointer-events-none absolute inset-0 bg-hero-grid bg-[length:60px_60px]"
      />

      <div
        data-hero-geo
        aria-hidden="true"
        className="pointer-events-none absolute right-[5%] top-[10%] w-[200px] animate-geo-float opacity-60"
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" stroke="rgba(201,168,76,0.3)" strokeWidth="1" fill="none" />
          <polygon points="100,30 170,67 170,133 100,170 30,133 30,67" stroke="rgba(27,107,71,0.4)" strokeWidth="0.8" fill="none" />
          <circle cx="100" cy="100" r="40" stroke="rgba(201,168,76,0.2)" strokeWidth="0.5" fill="none" strokeDasharray="3 3" />
        </svg>
      </div>
      <div
        data-hero-geo
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[15%] left-[5%] w-40 animate-geo-float opacity-50 [animation-delay:-3s]"
      >
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="30" width="100" height="100" rx="8" stroke="rgba(201,168,76,0.25)" strokeWidth="1" fill="none" transform="rotate(45 80 80)" />
          <rect x="50" y="50" width="60" height="60" rx="4" stroke="rgba(27,107,71,0.35)" strokeWidth="0.6" fill="none" transform="rotate(45 80 80)" />
        </svg>
      </div>
      <div
        data-hero-geo
        aria-hidden="true"
        className="pointer-events-none absolute right-[20%] top-1/2 w-[120px] -translate-y-1/2 animate-geo-float opacity-40 [animation-delay:-6s]"
      >
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" stroke="rgba(201,168,76,0.15)" strokeWidth="1" strokeDasharray="6 3" />
          <circle cx="60" cy="60" r="30" stroke="rgba(201,168,76,0.25)" strokeWidth="0.5" />
          <path d="M60 10 L60 110 M10 60 L110 60 M25 25 L95 95 M95 25 L25 95" stroke="rgba(27,107,71,0.2)" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-[2] max-w-[620px] max-md:max-w-full">
        <div
          data-reveal
          className={cn(
            "mb-7 inline-flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.15em] text-gold max-md:justify-center is-visible",
            getRevealClass("up"),
          )}
        >
          <span className="h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
          Pakistan&apos;s Most Trusted Hijama Equipment Supplier
          <span className="h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
        </div>

        <h1
          data-reveal
          className={cn(
            "mb-7 flex flex-col font-display text-[clamp(3rem,5vw,5.5rem)] font-normal leading-[1.05] tracking-[-0.01em] text-white is-visible",
            getRevealClass("up", 1),
          )}
        >
          <span className="block">Elevate Your</span>
          <span className="block text-transparent [-webkit-text-stroke:1px_#c9a84c]">Hijama Practice</span>
          <span className="block">With Professional</span>
          <span className="block font-light italic text-white/60">Grade Equipment</span>
        </h1>

        <p
          data-reveal
          className={cn(
            "mb-10 max-w-[500px] text-[1.05rem] leading-[1.75] text-white/60 max-md:mx-auto is-visible",
            getRevealClass("up", 2),
          )}
        >
          Trusted by 500+ therapists, clinics, and training institutes across Pakistan.
          Premium quality tools that honour the Sunnah — delivered to your door.
        </p>

        <div
          data-reveal
          className={cn(
            "mb-14 flex flex-wrap items-center gap-5 max-md:justify-center is-visible",
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" aria-hidden="true">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </a>
        </div>

        <div
          data-reveal
          className={cn(
            "flex items-center border-t border-glass-border py-6 max-md:justify-center is-visible",
            getRevealClass("up", 4),
          )}
        >
          {HERO_STATS.map((stat, index) => (
            <Fragment key={stat.label}>
              {index > 0 ? <div className="h-12 w-px shrink-0 bg-glass-border" aria-hidden="true" /> : null}
              <CounterStat target={stat.target} suffix={stat.suffix} label={stat.label} />
            </Fragment>
          ))}
        </div>
      </div>

      <div
        data-hero-visual
        aria-hidden="true"
        className="relative z-[2] flex h-[500px] items-center justify-center max-md:mt-5 max-md:h-[280px]"
      >
        <div className="relative h-[340px] w-[260px] max-sm:h-[260px] max-sm:w-[200px]">
          <div className="absolute -inset-[60px] animate-glow-pulse rounded-full bg-cup-glow" />
          <div className="absolute left-[30%] top-[45%] z-[2] w-[100px] -translate-x-1/2 -translate-y-1/2 animate-cup-float opacity-50 [animation-delay:-1.5s]">
            <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 30 Q15 10 50 10 Q85 10 85 30 L80 100 Q80 130 50 130 Q20 130 20 100 Z" fill="url(#cupGrad1)" stroke="rgba(201,168,76,0.5)" strokeWidth="1" />
              <ellipse cx="50" cy="30" rx="35" ry="10" fill="url(#cupTop1)" stroke="rgba(201,168,76,0.6)" strokeWidth="1" />
              <defs>
                <linearGradient id="cupGrad1" x1="15" y1="10" x2="85" y2="130" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1a2a1a" />
                  <stop offset="1" stopColor="#0d1a0d" />
                </linearGradient>
                <linearGradient id="cupTop1" x1="15" y1="20" x2="85" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2a3a2a" />
                  <stop offset="1" stopColor="#1a2a1a" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute left-1/2 top-1/2 z-[3] w-40 -translate-x-1/2 -translate-y-1/2 animate-cup-float drop-shadow-[0_20px_40px_rgba(201,168,76,0.2)]">
            <svg viewBox="0 0 120 165" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 36 Q18 10 60 10 Q102 10 102 36 L96 118 Q96 155 60 155 Q24 155 24 118 Z" fill="url(#cupMain)" stroke="url(#cupStroke)" strokeWidth="1.5" />
              <ellipse cx="60" cy="36" rx="42" ry="13" fill="url(#cupTopMain)" stroke="url(#cupStroke)" strokeWidth="1" />
              <ellipse cx="60" cy="36" rx="38" ry="10" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="0.5" />
              <path d="M28 50 Q25 80 26 110" stroke="rgba(255,255,255,0.12)" strokeWidth="4" strokeLinecap="round" />
              <path d="M22 50 Q22 44 60 44 Q98 44 98 50" stroke="url(#goldBand)" strokeWidth="2" fill="none" />
              <defs>
                <linearGradient id="cupMain" x1="18" y1="10" x2="102" y2="155" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1D3A28" />
                  <stop offset="0.4" stopColor="#0F2018" />
                  <stop offset="1" stopColor="#060E0A" />
                </linearGradient>
                <linearGradient id="cupTopMain" x1="18" y1="23" x2="102" y2="49" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2D5A3D" />
                  <stop offset="1" stopColor="#1D3A28" />
                </linearGradient>
                <linearGradient id="cupStroke" x1="0" y1="0" x2="120" y2="165" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#C9A84C" />
                  <stop offset="0.5" stopColor="#E8C96A" />
                  <stop offset="1" stopColor="#C9A84C" />
                </linearGradient>
                <linearGradient id="goldBand" x1="22" y1="44" x2="98" y2="50" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#C9A84C" />
                  <stop offset="0.5" stopColor="#FFE5A0" />
                  <stop offset="1" stopColor="#C9A84C" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute left-[72%] top-[55%] z-[2] w-20 -translate-x-1/2 -translate-y-1/2 animate-cup-float opacity-40 [animation-delay:-3s]">
            <svg viewBox="0 0 80 115" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 24 Q12 8 40 8 Q68 8 68 24 L64 82 Q64 105 40 105 Q16 105 16 82 Z" fill="url(#cupSide)" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
              <ellipse cx="40" cy="24" rx="28" ry="8" fill="url(#cupSideTop)" stroke="rgba(201,168,76,0.35)" strokeWidth="0.8" />
              <defs>
                <linearGradient id="cupSide" x1="12" y1="8" x2="68" y2="105" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#152A1F" />
                  <stop offset="1" stopColor="#080F0B" />
                </linearGradient>
                <linearGradient id="cupSideTop" x1="12" y1="16" x2="68" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#234530" />
                  <stop offset="1" stopColor="#152A1F" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute left-1/2 top-1/2 z-[1] h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 animate-suction-expand rounded-full border border-green-mid/30" />
          <div className="absolute left-1/2 top-1/2 z-[1] h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 animate-suction-expand rounded-full border border-green-mid/30 [animation-delay:0.8s]" />
          <div className="absolute left-1/2 top-1/2 z-[1] h-60 w-60 -translate-x-1/2 -translate-y-1/2 animate-suction-expand rounded-full border border-green-mid/30 [animation-delay:1.6s]" />
        </div>
      </div>

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
