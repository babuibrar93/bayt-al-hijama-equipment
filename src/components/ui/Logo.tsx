import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/classes";

type LogoSize = "xs" | "sm" | "md" | "lg";

/** Logo PNG has wide black margins; scale up inside a round clip so the emblem fills the circle. */
const SIZE = {
  xs: {
    wrap: "h-9 w-9",
    zoom: "h-[185%] w-[185%]",
    title: "text-sm",
    gap: "gap-2.5",
  },
  sm: {
    wrap: "h-10 w-10",
    zoom: "h-[185%] w-[185%]",
    title: "text-[1.05rem] sm:text-[1.125rem]",
    gap: "gap-2.5",
  },
  md: {
    wrap: "h-11 w-11",
    zoom: "h-[185%] w-[185%]",
    title: "text-[1.125rem]",
    gap: "gap-3",
  },
  lg: {
    wrap: "h-14 w-14",
    zoom: "h-[185%] w-[185%]",
    title: "text-xl",
    gap: "gap-3.5",
  },
} as const;

interface LogoProps {
  size?: LogoSize;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  href?: string | null;
  showText?: boolean;
}

function LogoText({ className }: { className?: string }) {
  return (
    <span className="relative inline-block py-px">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-2 -inset-y-1 -z-10 rounded-md bg-gradient-to-r from-green-mid/15 via-gold/25 to-green-light/15 blur-[7px] animate-logo-glow"
      />
      <span
        className={cn(
          "relative bg-[length:240%_100%] bg-clip-text font-body font-semibold leading-none tracking-[0.02em] text-transparent",
          "bg-gradient-to-r from-white via-gold-light to-green-light",
          "animate-logo-shimmer",
          className,
        )}
      >
        {SITE.shortName}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm mix-blend-overlay"
      >
        <span className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-logo-beam" />
      </span>
    </span>
  );
}

export default function Logo({
  size = "sm",
  className,
  imageClassName,
  priority = false,
  href = "/",
  showText = true,
}: LogoProps) {
  const tokens = SIZE[size];

  const mark = (
    <>
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
          tokens.wrap,
        )}
        aria-hidden={showText}
      >
        <Image
          src={SITE.logo.src}
          alt={showText ? "" : SITE.logo.alt}
          width={SITE.logo.width}
          height={SITE.logo.height}
          priority={priority}
          className={cn(
            "absolute left-[60%] top-[80%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain",
            tokens.zoom,
            imageClassName,
          )}
        />
      </span>
      {showText ? <LogoText className={tokens.title} /> : null}
    </>
  );

  const classes = cn(
    "group/logo inline-flex shrink-0 items-center",
    showText && tokens.gap,
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={`${SITE.name} home`}>
        {mark}
      </Link>
    );
  }

  return <span className={classes}>{mark}</span>;
}
