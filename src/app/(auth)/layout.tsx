import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

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
      <Logo size="md" href="/" priority className="relative mb-8" />
      <div className="relative w-full max-w-md">{children}</div>
      <Link
        href="/"
        className="relative mt-6 text-sm text-white/50 transition-colors hover:text-white"
      >
        ← Back to store
      </Link>
    </div>
  );
}
