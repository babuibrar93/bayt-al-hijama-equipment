"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn, btnGhost } from "@/lib/classes";

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();

  const onSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={onSignOut}
      className={cn(btnGhost, "text-sm", className)}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Sign Out
    </button>
  );
}
