import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/utils";
import { cn, numeric } from "@/lib/classes";
import Breadcrumbs from "@/components/shop/Breadcrumbs";
import SignOutButton from "@/components/auth/SignOutButton";
import ProfileForm from "@/components/account/ProfileForm";
import { Button } from "@/components/ui";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/shop/StatusBadge";
import type { OrderWithItems } from "@/types/db";

export const metadata: Metadata = {
  title: "My Account",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/account");

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "full_name, phone, avatar_url, address_line1, address_line2, city, province, postal_code",
      )
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .order("created_at", { ascending: false }),
  ]);

  const orderList = (orders ?? []) as OrderWithItems[];

  return (
    <div className="px-4 pb-20 pt-nav sm:px-6">
      <div className="mx-auto w-full max-w-container pt-8 sm:pt-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Account" }]} />

        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-body text-[clamp(1.8rem,4vw,2.6rem)] font-normal text-white">
            My Account
          </h1>
          <SignOutButton />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
          <section>
            <h2 className="mb-3 font-body text-lg text-white">Profile</h2>
            <ProfileForm
              email={user.email ?? ""}
              profile={
                profile as React.ComponentProps<typeof ProfileForm>["profile"]
              }
            />
          </section>

          <section>
            <h2 className="mb-3 font-body text-lg text-white">Order History</h2>
            {orderList.length === 0 ? (
              <div className="flex flex-col items-center rounded-lg border border-glass-border bg-glass-bg px-6 py-14 text-center">
                <Package className="mb-4 h-9 w-9 text-white/30" aria-hidden="true" />
                <p className="mb-5 text-white/60">
                  You haven&apos;t placed any orders yet.
                </p>
                <Button href="/shop">Start Shopping</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orderList.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-lg border border-glass-border bg-glass-bg p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-glass-border pb-3.5">
                      <div className="flex items-center gap-3">
                        <span className={cn("text-base font-semibold text-gold", numeric)}>
                          {order.order_number}
                        </span>
                        <span className="text-xs text-white/40">
                          {new Date(order.created_at).toLocaleDateString("en-PK", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <OrderStatusBadge status={order.status} />
                        <PaymentStatusBadge status={order.payment_status} />
                      </div>
                    </div>

                    <ul className="mt-3.5 flex flex-col gap-2" role="list">
                      {order.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between gap-3 text-sm text-white/70"
                        >
                          <span>
                            {item.product_name}
                            <span className="text-white/40"> x{item.quantity}</span>
                          </span>
                          <span className={cn("shrink-0", numeric)}>
                            {formatPrice(item.unit_price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3.5 flex justify-between border-t border-glass-border pt-3.5 text-sm">
                      <span className="capitalize text-white/50">
                        {order.payment_method.replace("_", " ")}
                      </span>
                      <span className={cn("text-base font-semibold text-white", numeric)}>
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
