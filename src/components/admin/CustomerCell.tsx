import Image from "next/image";
import { cn } from "@/lib/classes";
import type { CustomerProfile } from "@/types/db";

interface CustomerCellProps {
  name: string;
  email?: string | null;
  phone?: string | null;
  customer?: CustomerProfile | null;
  className?: string;
}

/**
 * Shows a customer's avatar (uploaded profile image or initial) alongside
 * their name and a secondary contact line. Falls back gracefully for guests.
 */
export default function CustomerCell({
  name,
  email,
  phone,
  customer,
  className,
}: CustomerCellProps) {
  const displayName = customer?.full_name || name || "Guest";
  const secondary = phone || email || customer?.email || null;
  const avatar = customer?.avatar_url;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {avatar ? (
        <Image
          src={avatar}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-semibold text-gold">
          {initial}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{displayName}</p>
        {secondary && (
          <p className="truncate text-xs text-white/45">{secondary}</p>
        )}
        {!customer && (
          <span className="text-[0.65rem] uppercase tracking-wide text-white/30">
            Guest
          </span>
        )}
      </div>
    </div>
  );
}
