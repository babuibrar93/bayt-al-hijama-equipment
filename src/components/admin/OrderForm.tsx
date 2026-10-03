"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { formatPrice } from "@/utils";
import { PROVINCES } from "@/lib/validation/order";
import { numeric } from "@/lib/classes";
import type { OrderStatus, PaymentMethod, PaymentStatus, Product } from "@/types/db";

interface LineState {
  productId: string;
  quantity: string;
  unitPrice: string;
}

interface OrderFormProps {
  products: Pick<
    Product,
    "id" | "name" | "price" | "cost_price" | "stock"
  >[];
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

export default function OrderForm({
  products,
  mode = "create",
  orderId,
  orderNumber,
  lockItems = false,
  initial,
}: OrderFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState(initial?.customerName ?? "");
  const [customerPhone, setCustomerPhone] = useState(
    initial?.customerPhone ?? "",
  );
  const [customerEmail, setCustomerEmail] = useState(
    initial?.customerEmail ?? "",
  );
  const [line1, setLine1] = useState(initial?.line1 ?? "Walk-in / WhatsApp");
  const [city, setCity] = useState(initial?.city ?? "");
  const [province, setProvince] = useState(initial?.province ?? "Punjab");
  const [paymentMethod, setPaymentMethod] = useState(
    initial?.paymentMethod ?? "cod",
  );
  const [paymentStatus, setPaymentStatus] = useState(
    initial?.paymentStatus ?? "unpaid",
  );
  const [status, setStatus] = useState(initial?.status ?? "pending");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [shippingFee, setShippingFee] = useState(initial?.shippingFee ?? "");
  const [lines, setLines] = useState<LineState[]>(() => {
    if (initial?.items.length) {
      return initial.items.map((item) => ({
        productId: item.productId,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
      }));
    }
    return [{ productId: "", quantity: "1", unitPrice: "" }];
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

  const subtotal = lines.reduce((sum, line) => {
    const product = products.find((p) => p.id === line.productId);
    const price =
      line.unitPrice !== ""
        ? Number(line.unitPrice)
        : product
          ? Number(product.price)
          : 0;
    return sum + price * (Number(line.quantity) || 0);
  }, 0);

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

    setSubmitting(true);
    try {
      const payload = {
        customerName,
        customerPhone,
        customerEmail,
        paymentMethod,
        paymentStatus,
        status,
        notes,
        shippingFee: shippingFee === "" ? undefined : Number(shippingFee),
        address: {
          line1,
          city: city || "N/A",
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
          result.error ||
            (mode === "edit" ? "Could not update order" : "Could not create order"),
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
    <form onSubmit={onSubmit} className="w-full max-w-4xl">
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white sm:mb-5"
      >
        <ArrowLeft className="h-4 w-4" />{" "}
        {mode === "edit" ? "Back to order" : "Back to orders"}
      </Link>
      <h1 className="mb-4 font-body text-xl font-normal text-white sm:mb-6 sm:text-2xl lg:text-3xl">
        {mode === "edit"
          ? `Edit order${orderNumber ? ` ${orderNumber}` : ""}`
          : "Create order / bill"}
      </h1>

      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <Input
            label="Address line"
            required
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
          />
          <Input
            label="City"
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-white/70">Line items</span>
          {lockItems && (
            <p className="text-xs text-amber-200/80 sm:text-sm">
              Line items are locked after the order is shipped or delivered.
              Customer details and status can still be updated.
            </p>
          )}
          {lines.map((line, index) => (
            <div
              key={index}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.75rem] gap-2 rounded-md border border-glass-border p-3 sm:grid-cols-[minmax(0,1fr)_5.5rem_6.5rem_2.75rem]"
            >
              <div className="col-span-3 sm:col-span-1">
                <Select
                  options={productOptions}
                  value={line.productId}
                  onChange={(v) => onProductChange(index, v)}
                  searchable
                  disabled={lockItems}
                />
              </div>
              <Input
                type="number"
                min="1"
                value={line.quantity}
                disabled={lockItems}
                onChange={(e) =>
                  setLines((curr) =>
                    curr.map((l, i) =>
                      i === index ? { ...l, quantity: e.target.value } : l,
                    ),
                  )
                }
                placeholder="Qty"
              />
              <Input
                type="number"
                min="0"
                value={line.unitPrice}
                disabled={lockItems}
                onChange={(e) =>
                  setLines((curr) =>
                    curr.map((l, i) =>
                      i === index ? { ...l, unitPrice: e.target.value } : l,
                    ),
                  )
                }
                placeholder="Unit price"
              />
              <button
                type="button"
                aria-label="Remove line"
                disabled={lockItems}
                onClick={() =>
                  setLines((curr) => curr.filter((_, i) => i !== index))
                }
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-glass-border text-white/50 hover:text-red-400 disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {!lockItems && (
            <button
              type="button"
              onClick={() =>
                setLines((curr) => [
                  ...curr,
                  { productId: "", quantity: "1", unitPrice: "" },
                ])
              }
              className="inline-flex w-fit items-center gap-1.5 text-sm text-gold"
            >
              <Plus className="h-4 w-4" /> Add line
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Shipping fee (optional)"
            type="number"
            min="0"
            value={shippingFee}
            onChange={(e) => setShippingFee(e.target.value)}
            placeholder="Auto if empty"
          />
          <div className="flex flex-col justify-end text-sm text-white/70">
            <span>
              Goods subtotal:{" "}
              <span className={numeric}>{formatPrice(subtotal)}</span>
            </span>
          </div>
        </div>

        <Textarea
          label="Notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button type="submit" loading={submitting} size="lg">
          {mode === "edit" ? "Save changes" : "Create order"}
        </Button>
      </div>
    </form>
  );
}
