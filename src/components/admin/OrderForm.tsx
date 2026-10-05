"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { formatPrice } from "@/utils";
import { PROVINCES } from "@/lib/validation/order";
import { currentKarachiDateKey } from "@/lib/admin/dates";
import { cn, numeric } from "@/lib/classes";
import type { OrderStatus, PaymentMethod, PaymentStatus, Product } from "@/types/db";

type CatalogProduct = Pick<
  Product,
  "id" | "name" | "price" | "cost_price" | "stock"
>;

interface LineState {
  productId: string;
  quantity: string;
  unitPrice: string;
}

interface OrderFormProps {
  products: CatalogProduct[];
  mode?: "create" | "edit";
  orderId?: string;
  orderNumber?: string;
  lockItems?: boolean;
  initial?: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    line1: string;
    city: string;
    province: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    status: OrderStatus;
    notes: string;
    shippingFee: string;
    /** Asia/Karachi YYYY-MM-DD */
    orderDate?: string;
    items: {
      productId: string;
      quantity: number;
      unitPrice: number;
    }[];
  };
}

const PAYMENT_OPTIONS = [
  { value: "cod", label: "Cash on Delivery" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "jazzcash", label: "JazzCash" },
  { value: "easypaisa", label: "Easypaisa" },
];

const CREATE_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
];

const EDIT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

function firstValidationMessage(issues: unknown): string | null {
  if (!issues || typeof issues !== "object") return null;
  const flat = issues as {
    formErrors?: string[];
    fieldErrors?: Record<string, string[] | undefined>;
  };
  const formError = flat.formErrors?.find(Boolean);
  if (formError) return formError;
  for (const messages of Object.values(flat.fieldErrors ?? {})) {
    const message = messages?.find(Boolean);
    if (message) return message;
  }
  return null;
}

/** While editing an active order, qty already on lines counts as available stock. */
function withReservedStock(
  list: CatalogProduct[],
  lines: LineState[],
  creditReserved: boolean,
): CatalogProduct[] {
  if (!creditReserved) return list;
  const reserved = new Map<string, number>();
  for (const line of lines) {
    if (!line.productId) continue;
    reserved.set(
      line.productId,
      (reserved.get(line.productId) ?? 0) + (Number(line.quantity) || 0),
    );
  }
  return list.map((product) => ({
    ...product,
    stock: Number(product.stock) + (reserved.get(product.id) ?? 0),
  }));
}

export default function OrderForm({
  products: initialProducts,
  mode = "create",
  orderId,
  orderNumber,
  lockItems = false,
  initial,
}: OrderFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [customerName, setCustomerName] = useState(initial?.customerName ?? "");
  const [customerPhone, setCustomerPhone] = useState(
    initial?.customerPhone ?? "",
  );
  const [customerEmail, setCustomerEmail] = useState(
    initial?.customerEmail ?? "",
  );
  const [line1, setLine1] = useState(() => {
    const raw = initial?.line1?.trim() ?? "";
    return raw === "Walk-in / WhatsApp" ? "" : raw;
  });
  const [city, setCity] = useState(initial?.city ?? "");
  const [province, setProvince] = useState(initial?.province || "Punjab");
  const [paymentMethod, setPaymentMethod] = useState(
    initial?.paymentMethod ?? "cod",
  );
  const [paymentStatus, setPaymentStatus] = useState(
    initial?.paymentStatus ?? "unpaid",
  );
  const [status, setStatus] = useState(initial?.status ?? "pending");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [shippingFee, setShippingFee] = useState(initial?.shippingFee ?? "");
  const [orderDate, setOrderDate] = useState(
    initial?.orderDate ?? currentKarachiDateKey(),
  );
  const [lines, setLines] = useState<LineState[]>(() => {
    if (initial?.items.length) {
      return initial.items.map((item) => ({
        productId: item.productId,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
      }));
    }
    return [{ productId: "", quantity: "1", unitPrice: "0" }];
  });

  const productOptions = useMemo(
    () => [
      { value: "", label: "Select product" },
      ...products.map((p) => ({
        value: p.id,
        label: `${p.name} (stock ${p.stock}) — ${formatPrice(p.price)}`,
      })),
    ],
    [products],
  );

  const lineAmounts = lines.map((line) => {
    const product = products.find((p) => p.id === line.productId);
    const price =
      line.unitPrice !== ""
        ? Number(line.unitPrice)
        : product
          ? Number(product.price)
          : 0;
    const qty = Number(line.quantity) || 0;
    return { price, qty, total: price * qty };
  });

  const subtotal = lineAmounts.reduce((sum, line) => sum + line.total, 0);
  const shippingN = shippingFee === "" ? null : Number(shippingFee) || 0;
  const estimatedTotal = subtotal + (shippingN ?? 0);

  const onProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    setLines((curr) =>
      curr.map((line, i) =>
        i === index
          ? {
              ...line,
              productId,
              unitPrice: product ? String(product.price) : "",
            }
          : line,
      ),
    );
  };

  const refreshProducts = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const activeOnly = mode === "create";
      const res = await fetch(
        `/api/admin/products?active=${activeOnly ? "1" : "0"}`,
      );
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Could not refresh products");
      }
      const next = (result.products ?? []) as CatalogProduct[];
      const creditReserved = mode === "edit" && status !== "cancelled";
      setProducts(withReservedStock(next, lines, creditReserved));
      toast.success("Product stock refreshed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not refresh products",
      );
    } finally {
      setRefreshing(false);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const items = lines
      .filter((l) => l.productId)
      .map((l) => ({
        productId: l.productId,
        quantity: Number(l.quantity),
        unitPrice: l.unitPrice === "" ? undefined : Number(l.unitPrice),
      }));
    if (items.length === 0) {
      toast.error("Add at least one product");
      return;
    }
    if (items.some((item) => !Number.isFinite(item.quantity) || item.quantity < 1)) {
      toast.error("Quantity must be at least 1");
      return;
    }
    if (
      items.some(
        (item) =>
          item.unitPrice != null &&
          (!Number.isFinite(item.unitPrice) || item.unitPrice < 0),
      )
    ) {
      toast.error("Unit price must be 0 or greater");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        paymentMethod,
        paymentStatus,
        status,
        notes: notes.trim(),
        orderDate,
        shippingFee: shippingFee === "" ? undefined : Number(shippingFee),
        address: {
          line1: line1.trim(),
          city: city.trim(),
          province,
        },
        ...(lockItems ? {} : { items }),
      };

      const res = await fetch(
        mode === "edit" ? `/api/admin/orders/${orderId}` : "/api/admin/orders",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = await res.json();
      if (!res.ok) {
        throw new Error(
          firstValidationMessage(result.issues) ||
            result.error ||
            (mode === "edit"
              ? "Could not update order"
              : "Could not create order"),
        );
      }
      toast.success(
        mode === "edit"
          ? "Order updated"
          : `Order ${result.orderNumber} created`,
      );
      const id = mode === "edit" ? orderId : result.id;
      router.push(`/admin/orders/${id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
      setSubmitting(false);
    }
  };

  const backHref =
    mode === "edit" && orderId ? `/admin/orders/${orderId}` : "/admin/orders";

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6 sm:gap-3">
        <Button
          href={backHref}
          variant="subtle"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          className="shrink-0"
        >
          Back
        </Button>
        <div className="min-w-0">
          <h1 className="truncate font-body text-xl font-normal text-white sm:text-2xl lg:text-3xl">
            {mode === "edit"
              ? `Edit order${orderNumber ? ` ${orderNumber}` : ""}`
              : "Create order / bill"}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4 sm:space-y-5">
          <section className="rounded-lg border border-glass-border bg-glass-bg p-3 sm:p-4 lg:p-5">
            <h2 className="mb-3 text-sm font-medium text-white/80 sm:mb-4">
              Customer
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              <Input
                label="Customer name"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Input
                label="Phone (WhatsApp)"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="03xxxxxxxxx"
              />
              <Input
                label="Email (optional)"
                type="text"
                inputMode="email"
                autoComplete="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@email.com"
              />
              <Input
                label="City (optional)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Select
                label="Province"
                options={PROVINCES.map((p) => ({ value: p, label: p }))}
                value={province}
                onChange={setProvince}
                searchable={false}
              />
            </div>
            <Textarea
              label="Address (optional)"
              rows={2}
              autoGrow
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              placeholder="House / street, area, landmark"
              containerClassName="mt-3 sm:mt-4"
            />
          </section>

          <section className="rounded-lg border border-glass-border bg-glass-bg p-3 sm:p-4 lg:p-5">
            <h2 className="mb-3 text-sm font-medium text-white/80 sm:mb-4">
              Payment & status
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              <Input
                label="Order date"
                type="date"
                required
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
              <Select
                label="Payment method"
                options={PAYMENT_OPTIONS}
                value={paymentMethod}
                onChange={(v) => setPaymentMethod(v as PaymentMethod)}
                searchable={false}
              />
              <Select
                label="Payment status"
                options={[
                  { value: "unpaid", label: "Unpaid" },
                  { value: "paid", label: "Paid" },
                  { value: "refunded", label: "Refunded" },
                ]}
                value={paymentStatus}
                onChange={(v) => setPaymentStatus(v as PaymentStatus)}
                searchable={false}
              />
              <Select
                label="Order status"
                options={
                  mode === "edit" ? EDIT_STATUS_OPTIONS : CREATE_STATUS_OPTIONS
                }
                value={status}
                onChange={(v) => setStatus(v as OrderStatus)}
                searchable={false}
              />
            </div>
          </section>

          <section className="rounded-lg border border-glass-border bg-glass-bg p-3 sm:p-4 lg:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
              <h2 className="text-sm font-medium text-white/80">Line items</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={refreshProducts}
                  disabled={refreshing}
                  aria-label="Refresh product stock"
                  title="Refresh product stock"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white/70 transition-colors hover:border-gold/40 hover:bg-gold/10 hover:text-gold disabled:opacity-40"
                >
                  <RefreshCw
                    className={cn("h-4 w-4", refreshing && "animate-spin")}
                  />
                </button>
                {!lockItems && (
                  <button
                    type="button"
                    onClick={() =>
                      setLines((curr) => [
                        ...curr,
                        { productId: "", quantity: "1", unitPrice: "0" },
                      ])
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gold/30 bg-gold/10 px-3 text-sm text-gold transition-colors hover:border-gold/50 hover:bg-gold/15 hover:text-gold-light"
                  >
                    <Plus className="h-4 w-4" /> Add line
                  </button>
                )}
              </div>
            </div>
            {lockItems && (
              <p className="mb-3 text-xs text-amber-200/80 sm:text-sm">
                Line items are locked after the order is shipped or delivered.
                Customer details and status can still be updated.
              </p>
            )}

            <div className="flex flex-col gap-3">
              {lines.map((line, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-2 rounded-md border border-white/10 bg-black/20 p-2.5 sm:grid-cols-[minmax(0,1fr)_5.5rem_7.5rem_2.75rem] sm:items-end sm:gap-3 sm:border-0 sm:bg-transparent sm:p-0"
                >
                  <Select
                    label="Product"
                    options={productOptions}
                    value={line.productId}
                    onChange={(v) => onProductChange(index, v)}
                    searchable
                    disabled={lockItems}
                  />
                  <div className="grid grid-cols-[1fr_1.4fr_2.75rem] items-end gap-2 sm:contents">
                    <Input
                      label="Qty"
                      type="number"
                      min="1"
                      value={line.quantity}
                      disabled={lockItems}
                      onChange={(e) =>
                        setLines((curr) =>
                          curr.map((l, i) =>
                            i === index
                              ? { ...l, quantity: e.target.value }
                              : l,
                          ),
                        )
                      }
                      aria-label="Quantity"
                    />
                    <Input
                      label="Unit price"
                      type="number"
                      min="0"
                      value={line.unitPrice}
                      placeholder="0"
                      disabled={lockItems}
                      onChange={(e) =>
                        setLines((curr) =>
                          curr.map((l, i) =>
                            i === index
                              ? { ...l, unitPrice: e.target.value }
                              : l,
                          ),
                        )
                      }
                      aria-label="Unit price"
                    />
                    <button
                      type="button"
                      aria-label="Remove line"
                      disabled={lockItems || lines.length <= 1}
                      onClick={() =>
                        setLines((curr) => curr.filter((_, i) => i !== index))
                      }
                      className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/20 bg-white/5 text-white/50 transition-colors hover:border-red-400/40 hover:text-red-400 disabled:opacity-40"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-0 lg:space-y-4">
          <div className="rounded-lg border border-glass-border bg-glass-bg p-3 sm:p-4">
            <Textarea
              label="Notes"
              rows={3}
              autoGrow
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes for this order"
            />
          </div>

          <div className="rounded-lg border border-glass-border bg-glass-bg p-3 sm:p-4">
            <h2 className="mb-3 text-sm font-medium text-white/80">Summary</h2>
            <Input
              label="Shipping fee"
              type="number"
              min="0"
              value={shippingFee}
              onChange={(e) => setShippingFee(e.target.value)}
              placeholder="Auto if empty"
              hint="Leave empty to use default shipping"
            />
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-3 text-white/60">
                <dt>Goods subtotal</dt>
                <dd className={`text-white ${numeric}`}>
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 text-white/60">
                <dt>Shipping</dt>
                <dd className={`text-white ${numeric}`}>
                  {shippingN == null ? "Auto" : formatPrice(shippingN)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-glass-border pt-2.5 font-medium text-white">
                <dt>Total</dt>
                <dd className={`text-gold ${numeric}`}>
                  {shippingN == null
                    ? formatPrice(subtotal)
                    : formatPrice(estimatedTotal)}
                  {shippingN == null && (
                    <span className="ml-1 text-xs font-normal text-white/40">
                      + ship
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <Button
            type="submit"
            loading={submitting}
            size="lg"
            className="w-full"
          >
            {mode === "edit" ? "Save changes" : "Create order"}
          </Button>
        </aside>
      </div>
    </form>
  );
}
