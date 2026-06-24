import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <h1 className="mb-3 font-display text-2xl text-white">
            Supabase not configured
          </h1>
          <p className="text-white/60">
            Add your Supabase environment variables and run the schema to use the
            admin panel. See <code className="text-gold">supabase/README.md</code>.
          </p>
        </div>
      </div>
    );
  }

  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  return (
    <AdminShell admin={{ email: admin.email, fullName: admin.fullName }}>
      {children}
    </AdminShell>
  );
}
