import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search } from "lucide-react";
import { SITE } from "@/constants/site";
import { WHATSAPP } from "@/constants/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { btnGhost, btnPrimary } from "@/lib/classes";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you are looking for could not be found. Browse our Hijama equipment shop or get in touch.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-24 text-center sm:px-6">
      <span
        className="font-body text-[clamp(5rem,18vw,11rem)] font-normal leading-none text-gold/90"
        aria-hidden="true"
      >
        404
      </span>
      <h1 className="mt-4 font-body text-3xl font-normal text-white sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-white/60">
        The page you are looking for may have been moved or no longer exists.
        Explore our Hijama equipment or reach out and we will point you the right
        way.
      </p>

      <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
        <Link href="/" className={btnGhost}>
          <Home className="h-4 w-4" aria-hidden="true" />
          Back Home
        </Link>
        <Link href="/shop" className={btnPrimary}>
          <Search className="h-4 w-4" aria-hidden="true" />
          Browse the Shop
        </Link>
      </div>

      <a
        href={WHATSAPP.cta}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-gold"
      >
        <WhatsAppIcon size={16} />
        Need help? Message us on WhatsApp at {SITE.phone}
      </a>
    </main>
  );
}
