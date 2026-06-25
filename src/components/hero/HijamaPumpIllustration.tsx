import { cn } from "@/lib/classes";

interface HijamaPumpIllustrationProps {
  className?: string;
  idSuffix?: string;
}

/** Pistol-style vacuum pump used with hijama cup sets. */
export default function HijamaPumpIllustration({
  className,
  idSuffix = "p",
}: HijamaPumpIllustrationProps) {
  return (
    <svg
      viewBox="0 0 150 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full drop-shadow-[0_16px_32px_rgba(0,0,0,0.5)]", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`pb-${idSuffix}`}
          x1="12"
          y1="18"
          x2="138"
          y2="92"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3a5244" />
          <stop offset="1" stopColor="#101814" />
        </linearGradient>
        <linearGradient id={`pg-${idSuffix}`} x1="0" y1="0" x2="150" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c9a84c" />
          <stop offset="1" stopColor="#e8c96a" />
        </linearGradient>
        <linearGradient id={`pt-${idSuffix}`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#1b6b47" />
          <stop offset="1" stopColor="#145a3a" />
        </linearGradient>
      </defs>

      <ellipse cx="75" cy="104" rx="42" ry="4.5" fill="rgba(0,0,0,0.35)" />

      {/* pistol grip + body */}
      <rect
        x="22"
        y="38"
        width="76"
        height="36"
        rx="11"
        fill={`url(#pb-${idSuffix})`}
        stroke={`url(#pg-${idSuffix})`}
        strokeWidth="1.3"
      />

      {/* barrel / nozzle */}
      <path
        d="M98 48 H126 C132 48 136 52 136 58 V62 C136 68 132 72 126 72 H98"
        fill={`url(#pb-${idSuffix})`}
        stroke={`url(#pg-${idSuffix})`}
        strokeWidth="1.3"
      />

      {/* release trigger guard */}
      <path
        d="M48 74 V86 C48 92 42 96 36 96 H24 C18 96 14 92 14 86 V80"
        stroke={`url(#pg-${idSuffix})`}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />

      {/* pressure gauge window */}
      <rect
        x="30"
        y="44"
        width="20"
        height="24"
        rx="4"
        fill="rgba(255,255,255,0.1)"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="0.8"
      />
      <circle cx="40" cy="56" r="6" fill="rgba(46,155,106,0.25)" stroke="rgba(46,155,106,0.5)" strokeWidth="0.6" />

      {/* top lever / trigger */}
      <path
        d="M40 24 L40 38 M34 30 L46 30"
        stroke={`url(#pg-${idSuffix})`}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* suction tip */}
      <circle cx="126" cy="60" r="10" fill={`url(#pt-${idSuffix})`} stroke={`url(#pg-${idSuffix})`} strokeWidth="1.1" />
      <circle cx="126" cy="60" r="4" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}
