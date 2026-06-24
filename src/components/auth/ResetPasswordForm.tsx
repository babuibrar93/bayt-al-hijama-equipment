"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button, Input } from "@/components/ui";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  // Supabase sets a recovery session when the user arrives via the email link.
  useEffect(() => {
    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated. You're signed in.");
    router.push("/account");
    router.refresh();
  };

  return (
    <div className="w-full rounded-lg border border-glass-border bg-glass-bg p-7 sm:p-8">
      <h1 className="mb-1.5 text-center font-display text-2xl text-white sm:text-3xl">
        Set New Password
      </h1>
      <p className="mb-7 text-center text-sm text-white/55">
        {ready
          ? "Choose a strong new password."
          : "Open this page from your password reset email to continue."}
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="New Password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" />}
          placeholder="••••••••"
          disabled={!ready}
        />
        <Input
          label="Confirm Password"
          type="password"
          required
          minLength={6}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" />}
          placeholder="••••••••"
          disabled={!ready}
        />
        <Button type="submit" loading={loading} fullWidth size="lg" disabled={!ready}>
          Update Password
        </Button>
      </form>
    </div>
  );
}
