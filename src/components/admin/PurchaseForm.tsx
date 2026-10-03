"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Select, Textarea, Checkbox } from "@/components/ui";
import { formatPrice } from "@/utils";
import { numeric } from "@/lib/classes";
import type { Product } from "@/types/db";

interface LineState {
  productId: string;
  quantity: string;
  unitCost: string;
}

interface PurchaseFormProps {
  products: Pick<Product, "id" | "name" | "cost_price" | "stock">[];
  mode?: "create" | "edit";
  purchaseId?: string;
  initial?: {
    supplierName: string;
    supplierPhone: string;
    notes: string;
    status: "draft" | "confirmed" | "cancelled";
    items: { productId: string | null; productName: string; unitCost: number; quantity: number }[];
  };
}

export default function PurchaseForm({
  products,
  mode = "create",
  purchaseId,
  initial,
}: PurchaseFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [supplierName, setSupplierName] = useState(initial?.supplierName ?? "");
  const [supplierPhone, setSupplierPhone] = useState(
    initial?.supplierPhone ?? "",
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [status, setStatus] = useState<"draft" | "confirmed" | "cancelled">(
    initial?.status ?? "draft",
  );
  const [updateCosts, setUpdateCosts] = useState(false);
  const [lines, setLines] = useState<LineState[]>(() => {
    if (initial?.items.length) {
      return initial.items.map((item) => ({
        productId: item.productId ?? "",
        quantity: String(item.quantity),
        unitCost: String(item.unitCost),
      }));
    }
    return [{ productId: "", quantity: "1", unitCost: "" }];
  });

  const productOptions = useMemo(
    () => [
      { value: "", label: "Select product" },
      ...products.map((p) => ({
        value: p.id,
        label: `${p.name}${p.cost_price != null ? ` — cost ${formatPrice(p.cost_price)}` : ""}`,
      })),
    ],
    [products],
  );

  const subtotal = lines.reduce((sum, line) => {
    return sum + (Number(line.unitCost) || 0) * (Number(line.quantity) || 0);
  }, 0);

  const onProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    setLines((curr) =>
      curr.map((line, i) =>
        i === index
          ? {
              ...line,
              productId,
              unitCost:
                product?.cost_price != null ? String(product.cost_price) : "",
            }
          : line,
      ),
    );
  };

  const buildItems = () =>
    lines
      .filter((l) => l.productId && Number(l.quantity) > 0)
      .map((l) => {
        const product = products.find((p) => p.id === l.productId);
        return {
          productId: l.productId,
          productName: product?.name ?? "Product",
          unitCost: Number(l.unitCost),
          quantity: Number(l.quantity),
        };
      });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const items = buildItems();
    if (items.length === 0) {
      toast.error("Add at least one product line");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        mode === "edit"
          ? `/api/admin/purchases/${purchaseId}`
          : "/api/admin/purchases",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supplierName,
            supplierPhone,
            notes,
            status: status === "cancelled" ? "cancelled" : status,
            items,
            updateProductCosts: updateCosts,
          }),
        },
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Save failed");
      toast.success(mode === "edit" ? "Purchase updated" : "Purchase created");
      const id = mode === "edit" ? purchaseId : result.id;
      router.push(`/admin/purchases/${id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-3xl">
      <Link
        href="/admin/purchases"
        className="mb-4 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white sm:mb-5"
      >
        <ArrowLeft className="h-4 w-4" /> Back to purchases
      </Link>
      <h1 className="mb-4 font-body text-xl font-normal text-white sm:mb-6 sm:text-2xl lg:text-3xl">
        {mode === "edit" ? "Edit purchase" : "New purchase bill"}
      </h1>

      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <Input
            label="Supplier name"
            required
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />
          <Input
            label="Supplier phone"
            value={supplierPhone}
            onChange={(e) => setSupplierPhone(e.target.value)}
          />
          <Select
            label="Status"
            options={[
              { value: "draft", label: "Draft (no stock change)" },
              { value: "confirmed", label: "Confirmed (stock in)" },
              ...(mode === "edit"
                ? [{ value: "cancelled", label: "Cancelled" }]
                : []),
            ]}
            value={status}
            onChange={(v) =>
              setStatus(v as "draft" | "confirmed" | "cancelled")
            }
            searchable={false}
          />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-white/70">Items</span>
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
                />
              </div>
              <Input
                type="number"
                min="1"
                value={line.quantity}
                onChange={(e) =>
                  setLines((curr) =>
                    curr.map((l, i) =>
                      i === index ? { ...l, quantity: e.target.value } : l,
                    ),
                  )
                }
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                value={line.unitCost}
                onChange={(e) =>
                  setLines((curr) =>
                    curr.map((l, i) =>
                      i === index ? { ...l, unitCost: e.target.value } : l,
                    ),
                  )
                }
                placeholder="Unit cost"
              />
              <button
                type="button"
                aria-label="Remove"
                onClick={() =>
                  setLines((curr) => curr.filter((_, i) => i !== index))
                }
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-glass-border text-white/50 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setLines((curr) => [
                ...curr,
                { productId: "", quantity: "1", unitCost: "" },
              ])
            }
            className="inline-flex w-fit items-center gap-1.5 text-sm text-gold"
          >
            <Plus className="h-4 w-4" /> Add line
          </button>
        </div>

        <p className={`text-sm text-white/70 ${numeric}`}>
          Subtotal: {formatPrice(subtotal)}
        </p>

        <Checkbox
          label="Update product cost prices from these lines"
          checked={updateCosts}
          onChange={(e) => setUpdateCosts(e.target.checked)}
        />

        <Textarea
          label="Notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button type="submit" loading={submitting} size="lg">
          {mode === "edit" ? "Save purchase" : "Create purchase"}
        </Button>
      </div>
    </form>
  );
}
