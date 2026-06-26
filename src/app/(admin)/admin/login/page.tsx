import type { Metadata } from "next";
import { Suspense } from "react";
import Logo from "@/components/ui/Logo";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-grad-hero opacity-60"
        aria-hidden="true"
      />
      <Logo size="md" href="/" priority className="relative mb-8" />
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
