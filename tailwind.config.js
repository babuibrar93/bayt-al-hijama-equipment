/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/classes.ts",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: "#050c08",
          2: "#080f0a",
          3: "#0d1a10",
        },
        green: {
          deep: "#0a1f10",
          mid: "#1b6b47",
          light: "#2e9b6a",
        },
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e8c96a",
          pale: "#f5e4a8",
        },
        glass: {
          bg: "rgba(255, 255, 255, 0.04)",
          "bg-hover": "rgba(255, 255, 255, 0.07)",
          border: "rgba(255, 255, 255, 0.08)",
        },
        whatsapp: "#25d366",
      },
      fontFamily: {
        display: [
          "var(--font-cormorant)",
          "Cormorant Garamond",
          "Georgia",
          "serif",
        ],
        body: [
          "var(--font-inter)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        urdu: ["var(--font-noto-urdu)", "Noto Nastaliq Urdu", "serif"],
      },
      maxWidth: {
        container: "1220px",
      },
      spacing: {
        nav: "72px",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "12px",
        "2xl": "12px",
        "3xl": "12px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      backgroundImage: {
        "grad-gold":
          "linear-gradient(135deg, #c9a84c 0%, #e8c96a 50%, #c9a84c 100%)",
        "grad-hero":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(27, 107, 71, 0.25) 0%, transparent 70%)",
        "hero-grid":
          "linear-gradient(rgba(27, 107, 71, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(27, 107, 71, 0.04) 1px, transparent 1px)",
        "why-pattern":
          "repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(27, 107, 71, 0.02) 60px, rgba(27, 107, 71, 0.02) 61px)",
        "cta-bg":
          "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(27, 107, 71, 0.2) 0%, transparent 70%)",
        "cup-glow":
          "radial-gradient(circle, rgba(27, 107, 71, 0.3) 0%, rgba(201, 168, 76, 0.1) 40%, transparent 70%)",
        "trust-card-shine":
          "linear-gradient(135deg, rgba(201, 168, 76, 0.05) 0%, transparent 60%)",
        "product-visual":
          "linear-gradient(180deg, rgba(27, 107, 71, 0.08) 0%, transparent 100%)",
        "product-glow":
          "conic-gradient(from 0deg, transparent, rgba(201, 168, 76, 0.15), transparent, rgba(27, 107, 71, 0.15), transparent)",
      },
      keyframes: {
        loaderSpin: { to: { transform: "rotate(360deg)" } },
        loaderFill: { to: { width: "100%" } },
        geoFloat: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-12px) rotate(2deg)" },
          "66%": { transform: "translateY(8px) rotate(-1deg)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.7", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
        cupFloat: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) translateY(0)",
          },
          "50%": {
            transform: "translate(-50%, -50%) translateY(-16px)",
          },
        },
        heroFloatA: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) translateY(0) translateX(0) rotate(-6deg)",
          },
          "50%": {
            transform: "translate(-50%, -50%) translateY(-14px) translateX(8px) rotate(-4deg)",
          },
        },
        heroFloatB: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) translateY(0) scale(1)",
          },
          "50%": {
            transform: "translate(-50%, -50%) translateY(-22px) scale(1.02)",
          },
        },
        heroFloatC: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) translateY(0) translateX(0) rotate(5deg)",
          },
          "50%": {
            transform: "translate(-50%, -50%) translateY(-12px) translateX(-10px) rotate(7deg)",
          },
        },
        heroSuctionSeal: {
          "0%, 100%": { transform: "scaleY(1) scaleX(1)" },
          "40%": { transform: "scaleY(0.96) scaleX(1.02)" },
          "70%": { transform: "scaleY(1.01) scaleX(0.99)" },
        },
        heroValvePulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        heroPumpTrigger: {
          "0%, 100%": { transform: "rotate(0deg) translateY(0)" },
          "35%": { transform: "rotate(-4deg) translateY(2px)" },
          "55%": { transform: "rotate(-2deg) translateY(1px)" },
        },
        heroPumpIdle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        vacuumFlow: {
          "0%": { strokeDashoffset: "24" },
          "100%": { strokeDashoffset: "0" },
        },
        suctionExpand: {
          "0%": {
            opacity: "0.8",
            transform: "translate(-50%, -50%) scale(0.5)",
          },
          "100%": {
            opacity: "0",
            transform: "translate(-50%, -50%) scale(1.8)",
          },
        },
        scrollLine: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        marqueeScroll: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        borderSpin: { to: { transform: "rotate(360deg)" } },
        urgencyPulse: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(46, 155, 106, 0.4)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.2)",
            boxShadow: "0 0 0 6px rgba(46, 155, 106, 0)",
          },
        },
        waPulse: {
          "0%": { opacity: "0.8", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(1.35)" },
        },
        particleRise: {
          "0%": {
            transform: "translateY(0) translateX(0) scale(1)",
            opacity: "0",
          },
          "10%": { opacity: "1" },
          "50%": {
            transform: "translateY(-120px) translateX(20px) scale(1.2)",
          },
          "90%": { opacity: "0.3" },
          "100%": {
            transform: "translateY(-240px) translateX(0) scale(0.5)",
            opacity: "0",
          },
        },
        logoShimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        logoGlow: {
          "0%, 100%": { opacity: "0.45", transform: "scale(0.92)" },
          "50%": { opacity: "0.85", transform: "scale(1.04)" },
        },
        logoBeam: {
          "0%": { transform: "translateX(-120%) skewX(-12deg)", opacity: "0" },
          "15%": { opacity: "1" },
          "85%": { opacity: "1" },
          "100%": { transform: "translateX(220%) skewX(-12deg)", opacity: "0" },
        },
        heroLift: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        orbit: {
          to: { transform: "rotate(360deg)" },
        },
        orbitCounter: {
          to: { transform: "rotate(-360deg)" },
        },
        orbitSlow: {
          to: { transform: "rotate(360deg)" },
        },
        orbitSlowReverse: {
          to: { transform: "rotate(-360deg)" },
        },
        turntable: {
          to: { transform: "rotateY(360deg)" },
        },
        turntableCounter: {
          to: { transform: "rotateY(-360deg)" },
        },
        heroSpotlight: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "loader-spin": "loaderSpin 4s linear infinite",
        "loader-fill": "loaderFill 2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "geo-float": "geoFloat 8s ease-in-out infinite",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
        "cup-float": "cupFloat 5s ease-in-out infinite",
        "hero-float-a": "heroFloatA 6s ease-in-out infinite",
        "hero-float-b": "heroFloatB 5.5s ease-in-out infinite",
        "hero-float-c": "heroFloatC 6.5s ease-in-out infinite",
        "hero-suction-seal": "heroSuctionSeal 2.8s ease-in-out infinite",
        "hero-valve-pulse": "heroValvePulse 1.4s ease-in-out infinite",
        "hero-pump-trigger": "heroPumpTrigger 2.8s ease-in-out infinite",
        "hero-pump-idle": "heroPumpIdle 4s ease-in-out infinite",
        "vacuum-flow": "vacuumFlow 1.2s linear infinite",
        "suction-expand": "suctionExpand 3s ease-out infinite",
        "scroll-line": "scrollLine 2s ease-in-out infinite",
        marquee: "marqueeScroll 30s linear infinite",
        "border-spin": "borderSpin 6s linear infinite",
        "urgency-pulse": "urgencyPulse 2s ease-in-out infinite",
        "wa-pulse": "waPulse 2.5s ease-out infinite",
        "particle-rise": "particleRise linear infinite",
        "logo-shimmer": "logoShimmer 6s ease-in-out infinite",
        "logo-glow": "logoGlow 4.5s ease-in-out infinite",
        "logo-beam": "logoBeam 5s ease-in-out infinite",
        "hero-lift": "heroLift 6s ease-in-out infinite",
        orbit: "orbit 26s linear infinite",
        "orbit-counter": "orbitCounter 26s linear infinite",
        "orbit-slow": "orbitSlow 36s linear infinite",
        "orbit-slow-reverse": "orbitSlowReverse 48s linear infinite",
        turntable: "turntable 22s linear infinite",
        "turntable-counter": "turntableCounter 22s linear infinite",
        "hero-spotlight": "heroSpotlight 14s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss/plugin")(({ addVariant }) => {
      addVariant("visible-state", "&.is-visible");
    }),
  ],
};
