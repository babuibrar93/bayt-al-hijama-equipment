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
        nav: "76px",
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
      },
      animation: {
        "loader-spin": "loaderSpin 4s linear infinite",
        "loader-fill": "loaderFill 2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "geo-float": "geoFloat 8s ease-in-out infinite",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
        "cup-float": "cupFloat 5s ease-in-out infinite",
        "suction-expand": "suctionExpand 3s ease-out infinite",
        "scroll-line": "scrollLine 2s ease-in-out infinite",
        marquee: "marqueeScroll 30s linear infinite",
        "border-spin": "borderSpin 6s linear infinite",
        "urgency-pulse": "urgencyPulse 2s ease-in-out infinite",
        "wa-pulse": "waPulse 2.5s ease-out infinite",
        "particle-rise": "particleRise linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss/plugin")(({ addVariant }) => {
      addVariant("visible-state", "&.is-visible");
    }),
  ],
};
