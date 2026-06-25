import { cn } from "@/lib/classes";

interface HijamaCupIllustrationProps {
  className?: string;
  valveColor?: "green" | "gold";
  idSuffix?: string;
}

/**
 * Realistic polycarbonate hijama cup — bell/dome body, wide white suction rim,
 * top one-way valve. Proportions match common No. 3–7 cups sold in Pakistan.
 */
export default function HijamaCupIllustration({
  className,
  valveColor = "green",
  idSuffix = "a",
}: HijamaCupIllustrationProps) {
  const valve = valveColor === "green" ? "#2e9b6a" : "#c9a84c";

  return (
    <svg
      viewBox="0 0 150 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`cg-${idSuffix}`}
          x1="30"
          y1="18"
          x2="120"
          y2="112"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="rgba(255,255,255,0.48)" />
          <stop offset="0.35" stopColor="rgba(210,232,220,0.18)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.06)" />
        </linearGradient>
        <linearGradient
          id={`cs-${idSuffix}`}
          x1="42"
          y1="28"
          x2="58"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="rgba(255,255,255,0.75)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <radialGradient id={`ci-${idSuffix}`} cx="50%" cy="58%" r="52%">
          <stop stopColor="rgba(46,155,106,0.07)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.2)" />
        </radialGradient>
        <linearGradient
          id={`cb-${idSuffix}`}
          x1="0"
          y1="0"
          x2="150"
          y2="128"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="rgba(201,168,76,0.75)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="1" stopColor="rgba(46,155,106,0.65)" />
        </linearGradient>
        <linearGradient id={`rim-${idSuffix}`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#f4f7f9" />
          <stop offset="1" stopColor="#c8d2da" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="75" cy="122" rx="46" ry="5" fill="rgba(0,0,0,0.38)" />

      {/* bell body — wide at bottom, narrow neck */}
      <path
        d="M48 42 C48 28 58 20 75 20 C92 20 102 28 102 42 L110 88 C112 102 98 110 75 110 C52 110 38 102 40 88 Z"
        fill={`url(#cg-${idSuffix})`}
        stroke={`url(#cb-${idSuffix})`}
        strokeWidth="1.5"
      />
      <path
        d="M48 42 C48 28 58 20 75 20 C92 20 102 28 102 42 L110 88 C112 102 98 110 75 110 C52 110 38 102 40 88 Z"
        fill={`url(#ci-${idSuffix})`}
      />

      {/* white suction rim band — the signature hijama cup feature */}
      <ellipse
        cx="75"
        cy="108"
        rx="36"
        ry="9"
        fill={`url(#rim-${idSuffix})`}
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.2"
      />
      <ellipse
        cx="75"
        cy="106.5"
        rx="36"
        ry="9"
        fill="none"
        stroke="rgba(180,190,200,0.5)"
        strokeWidth="0.6"
      />

      {/* inner rim edge */}
      <ellipse cx="75" cy="108" rx="28" ry="6.5" fill="rgba(0,0,0,0.12)" />

      {/* shoulder curve highlight */}
      <path
        d="M54 38 C54 30 64 26 75 26 C86 26 96 30 96 38"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
        fill="none"
      />
      <path d="M56 44 L60 96" stroke={`url(#cs-${idSuffix})`} strokeWidth="6" strokeLinecap="round" />

      {/* secondary reflection */}
      <path
        d="M92 50 L94 82"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* valve housing + one-way valve */}
      <rect
        x="66"
        y="4"
        width="18"
        height="16"
        rx="4"
        fill="#141f19"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.8"
      />
      <circle cx="75" cy="4" r="5.5" fill={valve} stroke="rgba(255,255,255,0.55)" strokeWidth="0.7" />
      <circle cx="73.5" cy="2.8" r="1.8" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}
