import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 bg-grad-hero opacity-60"
        aria-hidden="true"
      />
      <Link
        href="/"
        className="relative mb-8 flex items-center gap-2.5"
        aria-label={`${SITE.name} home`}
      >
        <span className="text-[1.5rem] leading-none text-gold" aria-hidden="true">
          ⬡
        </span>
        <span className="font-display text-xl font-semibold tracking-[0.03em] text-white">
          {SITE.shortName}
        </span>
      </Link>
      <div className="relative w-full max-w-md">{children}</div>
      <Link
        href="/"
        className="relative mt-8 text-sm text-white/50 transition-colors hover:text-white"
      >
        ← Back to store
      </Link>
    </div>
  );
}
