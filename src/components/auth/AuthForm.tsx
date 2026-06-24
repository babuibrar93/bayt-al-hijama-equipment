"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button, Input } from "@/components/ui";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const supabase = createClient();

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success("Account created. You're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
      }
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-lg border border-glass-border bg-glass-bg p-7 sm:p-8">
      <h1 className="mb-1.5 text-center font-display text-2xl text-white sm:text-3xl">
        {isSignup ? "Create Account" : "Welcome Back"}
      </h1>
      <p className="mb-7 text-center text-sm text-white/55">
        {isSignup
          ? "Save your details and track your orders."
          : "Sign in to view your orders and profile."}
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {isSignup && (
          <Input
            label="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            leftIcon={<User className="h-4 w-4" />}
            placeholder="Your name"
          />
        )}
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
        <div>
          <Input
            label="Password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignup ? "new-password" : "current-password"}
            leftIcon={<Lock className="h-4 w-4" />}
            placeholder="••••••••"
          />
          {!isSignup && (
            <div className="mt-1.5 text-right">
              <Link
                href="/forgot-password"
                className="text-xs text-white/50 transition-colors hover:text-gold"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </div>

        <Button type="submit" loading={loading} fullWidth size="lg" className="mt-1">
          {isSignup ? "Sign Up" : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/55">
        {isSignup ? "Already have an account? " : "Don't have an account? "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-medium text-gold transition-colors hover:text-gold-light"
        >
          {isSignup ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}
