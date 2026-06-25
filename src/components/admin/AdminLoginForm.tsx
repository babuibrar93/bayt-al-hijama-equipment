"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button, Input } from "@/components/ui";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      await supabase.auth.signOut();
      toast.error("This account does not have admin access.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-glass-border bg-glass-bg p-7 sm:p-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15">
          <ShieldCheck className="h-6 w-6 text-gold" aria-hidden="true" />
        </div>
        <h1 className="font-body text-2xl text-white">Admin Login</h1>
        <p className="mt-1 text-sm text-white/55">
          Sign in to manage products and orders.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          placeholder="admin@example.com"
        />
        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          leftIcon={<Lock className="h-4 w-4" />}
          placeholder="••••••••"
        />
        <Button type="submit" loading={loading} fullWidth size="lg" className="mt-1">
          Sign In
        </Button>
      </form>
    </div>
  );
}
