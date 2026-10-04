"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils";
import { cn, numeric } from "@/lib/classes";
import { Button, Input, Textarea, Select } from "@/components/ui";
import PaymentInstructions, {
  isPrepaidMethod,
} from "@/components/shop/PaymentInstructions";
import {
  checkoutSchema,
  type CheckoutFormValues,
  PROVINCES,
} from "@/lib/validation/order";
import {
  PAYMENT_OPTIONS,
  SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  getPaymentOption,
} from "@/constants/payment";

const PROVINCE_OPTIONS = PROVINCES.map((p) => ({ value: p, label: p }));
/** Persists shipping / payment-method form only (not the checkout step). */
const DRAFT_KEY = "bah-checkout-draft";

type CheckoutStep = "details" | "payment";

const EMPTY_VALUES: CheckoutFormValues = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  paymentMethod: "cod",
  notes: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    province: "Punjab",
    postalCode: "",
  },
};

function readDraftValues(): CheckoutFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { values?: unknown } | CheckoutFormValues;
    const candidate =
      parsed && typeof parsed === "object" && "values" in parsed
        ? parsed.values
        : parsed;
    const values = checkoutSchema.safeParse(candidate);
    return values.success ? values.data : null;
  } catch {
    return null;
  }
}

function writeDraftValues(values: CheckoutFormValues) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ values }));
  } catch {
    /* ignore quota / private mode */
  }
}

export default function CheckoutView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, isHydrated, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("details");
  const [pendingValues, setPendingValues] =
    useState<CheckoutFormValues | null>(null);
  const persistEnabled = useRef(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: EMPTY_VALUES,
  });

  const formValues = watch();
  const selectedMethod = formValues.paymentMethod;

  useEffect(() => {
    const draft = readDraftValues();
    const openPayment = searchParams.get("step") === "payment";

    if (draft) {
      reset(draft);
      setPendingValues(draft);
      // Only reopen payment step when URL explicitly asks (e.g. reload on step 2).
      // Fresh visits to /checkout always start on step 1 with saved details.
      if (openPayment && isPrepaidMethod(draft.paymentMethod)) {
        setStep("payment");
      } else {
        setStep("details");
      }
    } else {
      setStep("details");
    }
    setReady(true);
  }, [reset, searchParams]);

  useEffect(() => {
    if (!ready || submitting || !persistEnabled.current) return;
    const values =
      step === "payment" && pendingValues ? pendingValues : formValues;
    writeDraftValues(values);
  }, [ready, step, pendingValues, formValues, submitting]);

  useEffect(() => {
    if (isHydrated && items.length === 0 && !submitting) {
      router.replace("/cart");
    }
  }, [isHydrated, items.length, submitting, router]);

  if (!isHydrated || !ready || items.length === 0) {
    return <div className="py-20 text-center text-white/50">Loading...</div>;
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const paymentOption = getPaymentOption(selectedMethod);

  const placeOrder = async (values: CheckoutFormValues) => {
    setSubmitting(true);
    persistEnabled.current = false;
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
        persistEnabled.current = true;
        toast.error(result.error || "Could not place your order");
        setSubmitting(false);
        return;
      }

      // Keep shipping details for the next checkout; never reopen step 2
      // unless the URL is /checkout?step=payment.
      writeDraftValues(values);
      clear();
      const query = new URLSearchParams({
        order: result.orderNumber,
        method: values.paymentMethod,
        total: String(result.total),
      });
      router.push(`/checkout/success?${query.toString()}`);
    } catch {
      persistEnabled.current = true;
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const onDetailsSubmit = async (values: CheckoutFormValues) => {
    if (isPrepaidMethod(values.paymentMethod)) {
      setPendingValues(values);
      writeDraftValues(values);
      setStep("payment");
      router.replace("/checkout?step=payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    await placeOrder(values);
  };

  const onConfirmPrepaid = async () => {
    if (!pendingValues) return;
    await placeOrder(pendingValues);
  };

  const goBackToDetails = () => {
    setStep("details");
    if (pendingValues) {
      reset(pendingValues);
      writeDraftValues(pendingValues);
    }
    router.replace("/checkout");
  };

  if (step === "payment" && pendingValues) {
    const method = pendingValues.paymentMethod;
    const option = getPaymentOption(method);

    return (
      <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] lg:gap-6">
        <section className="min-w-0 rounded-lg border border-glass-border bg-glass-bg p-4 sm:p-5 lg:p-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold/80">
            Step 2 of 2
          </p>
          <h2 className="mb-2 font-body text-lg text-white sm:text-xl">
            Pay via {option?.label ?? "selected method"}
          </h2>
          <p className="mb-4 text-sm text-white/55 sm:mb-5">
            Complete payment using the details below, then confirm your order.
          </p>
          <PaymentInstructions method={method} total={total} />
        </section>

        <aside className="h-fit rounded-lg border border-glass-border bg-glass-bg p-4 sm:p-5 lg:sticky lg:top-24 lg:p-6">
          <h2 className="mb-3 font-body text-lg text-white">Order total</h2>
          <p className={cn("mb-3 text-xl font-semibold text-gold sm:mb-4 sm:text-2xl", numeric)}>
            {formatPrice(total)}
          </p>
          <p className="mb-4 break-words text-xs text-white/45">
            Shipping to {pendingValues.customerName}, {pendingValues.address.city}
          </p>
          <Button
            type="button"
            loading={submitting}
            fullWidth
            size="lg"
            leftIcon={<Lock className="h-4 w-4" />}
            className="whitespace-nowrap"
            onClick={onConfirmPrepaid}
          >
            {submitting ? "Placing Order..." : "Confirm Order"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            fullWidth
            className="mt-2"
            disabled={submitting}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={goBackToDetails}
          >
            Back to details
          </Button>
        </aside>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onDetailsSubmit)}
      className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:gap-6"
    >
      <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
        <section className="rounded-lg border border-glass-border bg-glass-bg p-4 sm:p-5 lg:p-6">
          <h2 className="mb-4 font-body text-lg text-white">
            Shipping Details
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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

        <section className="rounded-lg border border-glass-border bg-glass-bg p-4 sm:p-5 lg:p-6">
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
          {isPrepaidMethod(selectedMethod) && (
            <p className="mt-3 text-xs text-white/50">
              Next you&apos;ll see{" "}
              {paymentOption?.label ?? "payment"} details and QR code before
              the order is placed.
            </p>
          )}
        </section>

        <section className="rounded-lg border border-glass-border bg-glass-bg p-4 sm:p-5 lg:p-6">
          <Textarea
            label="Order Notes (optional)"
            rows={3}
            placeholder="Any special instructions for delivery..."
            {...register("notes")}
          />
        </section>
      </div>

      <aside className="h-fit rounded-lg border border-glass-border bg-glass-bg p-4 sm:p-5 lg:sticky lg:top-24 lg:p-6">
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
          {submitting
            ? "Placing Order..."
            : isPrepaidMethod(selectedMethod)
              ? "Continue to Payment"
              : "Place Order"}
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
