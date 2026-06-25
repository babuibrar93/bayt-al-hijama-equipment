"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button, Input } from "@/components/ui";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="w-full rounded-lg border border-glass-border bg-glass-bg p-7 text-center sm:p-8">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-mid/20">
          <CheckCircle2 className="h-6 w-6 text-green-light" aria-hidden="true" />
        </div>
        <h1 className="mb-2 font-body text-2xl text-white">Check your email</h1>
        <p className="text-sm text-white/60">
          We&apos;ve sent a password reset link to{" "}
          <span className="text-white">{email}</span>. Follow the link to set a
          new password.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-gold transition-colors hover:text-gold-light"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border border-glass-border bg-glass-bg p-7 sm:p-8">
      <h1 className="mb-1.5 text-center font-body text-2xl text-white sm:text-3xl">
        Reset Password
      </h1>
      <p className="mb-7 text-center text-sm text-white/55">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          placeholder="you@example.com"
        />
        <Button type="submit" loading={loading} fullWidth size="lg">
          Send Reset Link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-white/55">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-gold transition-colors hover:text-gold-light"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
