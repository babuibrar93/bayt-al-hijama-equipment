"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils";
import { cn, numeric } from "@/lib/classes";
import { Button, Input, Textarea, Select } from "@/components/ui";
import {
  checkoutSchema,
  type CheckoutFormValues,
  PROVINCES,
} from "@/lib/validation/order";
import {
  PAYMENT_OPTIONS,
  SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
} from "@/constants/payment";

const PROVINCE_OPTIONS = PROVINCES.map((p) => ({ value: p, label: p }));

export default function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, isHydrated, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
      address: { province: "Punjab" },
    },
  });

  const selectedMethod = watch("paymentMethod");

  useEffect(() => {
    if (isHydrated && items.length === 0 && !submitting) {
      router.replace("/cart");
    }
  }, [isHydrated, items.length, submitting, router]);

  if (!isHydrated || items.length === 0) {
    return <div className="py-20 text-center text-white/50">Loading...</div>;
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const onSubmit = async (values: CheckoutFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Could not place your order");
        setSubmitting(false);
        return;
      }

      clear();
      const query = new URLSearchParams({
        order: result.orderNumber,
        method: values.paymentMethod,
        total: String(result.total),
      });
      router.push(`/checkout/success?${query.toString()}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px] lg:gap-6"
    >
      <div className="flex flex-col gap-6">
        <section className="rounded-lg border border-glass-border bg-glass-bg p-5 sm:p-6">
          <h2 className="mb-4 font-body text-lg text-white">
            Shipping Details
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Ahmed Khan"
              autoComplete="name"
              error={errors.customerName?.message}
              {...register("customerName")}
            />
            <Input
              label="Phone Number"
              required
              placeholder="+92 3XX XXXXXXX"
              inputMode="tel"
              autoComplete="tel"
              error={errors.customerPhone?.message}
              {...register("customerPhone")}
            />
            <Input
              label="Email (optional)"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              containerClassName="sm:col-span-2"
              error={errors.customerEmail?.message}
              {...register("customerEmail")}
            />
            <Input
              label="Street Address"
              required
              placeholder="House #, street, area"
              autoComplete="address-line1"
              containerClassName="sm:col-span-2"
              error={errors.address?.line1?.message}
              {...register("address.line1")}
            />
            <Input
              label="Apartment, suite (optional)"
              autoComplete="address-line2"
              containerClassName="sm:col-span-2"
              {...register("address.line2")}
            />
            <Input
              label="City"
              required
              placeholder="e.g. Lahore"
              autoComplete="address-level2"
              error={errors.address?.city?.message}
              {...register("address.city")}
            />
            <Controller
              control={control}
              name="address.province"
              render={({ field }) => (
                <Select
                  label="Province"
                  options={PROVINCE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.address?.province?.message}
                />
              )}
            />
            <Input
              label="Postal Code (optional)"
              autoComplete="postal-code"
              {...register("address.postalCode")}
            />
          </div>
        </section>

        <section className="rounded-lg border border-glass-border bg-glass-bg p-5 sm:p-6">
          <h2 className="mb-4 font-body text-lg text-white">Payment Method</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PAYMENT_OPTIONS.map((option) => (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-md border p-3.5 transition-all",
                  selectedMethod === option.id
                    ? "border-gold bg-gold/10"
                    : "border-glass-border hover:border-white/20",
                )}
              >
                <input
                  type="radio"
                  value={option.id}
                  {...register("paymentMethod")}
                  className="mt-1 h-4 w-4 accent-gold"
                  onChange={() => setValue("paymentMethod", option.id)}
                  checked={selectedMethod === option.id}
                />
                <span>
                  <span className="block text-sm font-medium text-white">
                    {option.label}
                  </span>
                  <span className="block text-xs text-white/55">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-glass-border bg-glass-bg p-5 sm:p-6">
          <Textarea
            label="Order Notes (optional)"
            rows={3}
            placeholder="Any special instructions for delivery..."
            {...register("notes")}
          />
        </section>
      </div>

      <aside className="h-fit rounded-lg border border-glass-border bg-glass-bg p-5 sm:p-6 lg:sticky lg:top-24">
        <h2 className="mb-4 font-body text-lg text-white">Your Order</h2>
        <ul className="mb-4 flex flex-col gap-3" role="list">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3 text-sm">
              <span className="min-w-0 text-white/70">
                {item.name}
                <span className="text-white/40"> x{item.quantity}</span>
              </span>
              <span className={cn("shrink-0 text-white/80", numeric)}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="flex flex-col gap-2.5 border-t border-glass-border pt-4 text-sm">
          <div className="flex justify-between text-white/70">
            <dt>Subtotal</dt>
            <dd className={numeric}>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-white/70">
            <dt>Shipping</dt>
            <dd className={numeric}>
              {shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
            </dd>
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-glass-border pt-3 text-base font-semibold text-white">
            <dt>Total</dt>
            <dd className={cn("text-lg", numeric)}>{formatPrice(total)}</dd>
          </div>
        </dl>

        <Button
          type="submit"
          loading={submitting}
          fullWidth
          size="lg"
          leftIcon={<Lock className="h-4 w-4" />}
          className="mt-5"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </Button>
        <Link
          href="/cart"
          className="mt-3 block text-center text-sm text-white/50 transition-colors hover:text-white"
        >
          Back to cart
        </Link>
      </aside>
    </form>
  );
}
