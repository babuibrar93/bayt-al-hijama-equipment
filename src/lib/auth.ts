import { createClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string | undefined;
  fullName: string | null;
}

/**
 * Returns the current user if they are an admin, otherwise null.
 * Use in admin Server Components and API routes as a guard.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) return null;

  return {
    id: user.id,
    email: user.email,
    fullName: profile.full_name,
  };
}
