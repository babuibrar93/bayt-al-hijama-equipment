"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, Input } from "@/components/ui";
import type { Profile } from "@/types/db";

interface ProfileFormProps {
  email: string;
  profile: Pick<
    Profile,
    | "full_name"
    | "phone"
    | "avatar_url"
    | "address_line1"
    | "address_line2"
    | "city"
    | "province"
    | "postal_code"
  > | null;
}

export default function ProfileForm({ email, profile }: ProfileFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(profile?.avatar_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    address_line1: profile?.address_line1 ?? "",
    address_line2: profile?.address_line2 ?? "",
    city: profile?.city ?? "",
    province: profile?.province ?? "",
    postal_code: profile?.postal_code ?? "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/account/avatar", { method: "POST", body: fd });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Upload failed");
      setAvatar(result.url);
      toast.success("Photo updated");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Save failed");
      toast.success("Profile saved");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const initial = (form.full_name || email).charAt(0).toUpperCase();

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-glass-border bg-glass-bg p-5 sm:p-6"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="relative">
          {avatar ? (
            <Image
              src={avatar}
              alt="Profile photo"
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-full object-cover"
            />
          ) : (
            <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gold/15 text-2xl font-semibold text-gold">
              {initial}
            </span>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            aria-label="Change profile photo"
            className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-glass-border bg-black-3 text-white/80 transition-colors hover:text-gold"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="h-3.5 w-3.5" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={onAvatar}
            className="hidden"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate font-body text-lg text-white">
            {form.full_name || "Your name"}
          </p>
          <p className="truncate text-sm text-white/50">{email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full Name" required value={form.full_name} onChange={set("full_name")} />
        <Input
          label="Phone"
          inputMode="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder="+92 3XX XXXXXXX"
        />
        <Input
          label="Address"
          containerClassName="sm:col-span-2"
          value={form.address_line1}
          onChange={set("address_line1")}
          placeholder="House #, street, area"
        />
        <Input
          label="Apartment, suite (optional)"
          containerClassName="sm:col-span-2"
          value={form.address_line2}
          onChange={set("address_line2")}
        />
        <Input label="City" value={form.city} onChange={set("city")} />
        <Input label="Province" value={form.province} onChange={set("province")} />
        <Input
          label="Postal Code"
          value={form.postal_code}
          onChange={set("postal_code")}
        />
      </div>

      <div className="mt-5">
        <Button type="submit" loading={saving}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
