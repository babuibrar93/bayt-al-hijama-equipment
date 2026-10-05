"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Input,
  Textarea,
  Modal,
  ConfirmModal,
} from "@/components/ui";
import { formatKarachiDayLabel, padDay } from "@/lib/admin/dates";
import { formatPrice } from "@/utils";
import { numeric } from "@/lib/classes";
import type { ReportManualEntry } from "@/types/db";

interface ReportManualEntryControlProps {
  year: number;
  month: number;
  day: number;
  entry?: ReportManualEntry | null;
  /** Compact trigger for table rows */
  compact?: boolean;
}

function calcProfit(sales: string, purchases: string) {
  return (Number(sales) || 0) - (Number(purchases) || 0);
}

export default function ReportManualEntryControl({
  year,
  month,
  day,
  entry = null,
  compact = false,
}: ReportManualEntryControlProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [revenue, setRevenue] = useState("");
  const [purchaseSpend, setPurchaseSpend] = useState("");
  const [orderCount, setOrderCount] = useState("");
  const [notes, setNotes] = useState("");

  const title = formatKarachiDayLabel(
    `${year}-${String(month).padStart(2, "0")}-${padDay(day)}`,
  );

  const openEditor = () => {
    setRevenue(entry ? String(Number(entry.revenue)) : "");
    setPurchaseSpend(entry ? String(Number(entry.purchase_spend)) : "");
    setOrderCount(entry ? String(Number(entry.order_count) || 0) : "0");
    setNotes(entry?.notes ?? "");
    setOpen(true);
  };

  const revenueN = Number(revenue) || 0;
  const purchasesN = Number(purchaseSpend) || 0;
  const orderCountN = Math.max(0, Math.floor(Number(orderCount) || 0));
  const profitN = calcProfit(revenue, purchaseSpend);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/report-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year,
          month,
          day,
          revenue: revenueN,
          purchaseSpend: purchasesN,
          grossProfit: profitN,
          orderCount: orderCountN,
          notes,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Save failed");
      toast.success(`Saved ${title}`);
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!entry) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/report-manual/${entry.id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Delete failed");
      toast.success("Entry removed");
      setDeleteOpen(false);
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {compact ? (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-2"
          onClick={openEditor}
          aria-label={entry ? `Edit ${title}` : `Add totals for ${title}`}
        >
          {entry ? (
            <Pencil className="h-3.5 w-3.5" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
        </Button>
      ) : (
        <Button
          size="sm"
          variant="subtle"
          leftIcon={
            entry ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )
          }
          onClick={openEditor}
          aria-label={entry ? "Edit totals" : "Add totals"}
          title={entry ? "Edit totals" : "Add totals"}
          className="h-11 w-full justify-center gap-1.5 px-3.5 sm:w-auto"
        >
          <span>{entry ? "Edit totals" : "Add totals"}</span>
        </Button>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={entry ? `Edit ${title}` : `Add totals — ${title}`}
        size="md"
        className="overflow-visible"
      >
        <form onSubmit={onSave} className="space-y-4">
          <Input
            label="Purchases (PKR)"
            type="number"
            min="0"
            step="0.01"
            required
            value={purchaseSpend}
            onChange={(e) => setPurchaseSpend(e.target.value)}
          />
          <Input
            label="Sales (PKR)"
            type="number"
            min="0"
            step="0.01"
            required
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
          />
          <Input
            label="Orders"
            type="number"
            min="0"
            step="1"
            required
            value={orderCount}
            onChange={(e) => setOrderCount(e.target.value)}
          />
          <div className="rounded-md border border-glass-border bg-black/20 px-3 py-2.5">
            <p className="text-xs text-white/55">Gross profit</p>
            <p className={`mt-0.5 text-base text-gold ${numeric}`}>
              {formatPrice(profitN)}
            </p>
          </div>
          <Textarea
            label="Notes (optional)"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-glass-border pt-4">
            {entry ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-red-300"
                leftIcon={<Trash2 className="h-4 w-4" />}
                onClick={() => setDeleteOpen(true)}
              >
                Remove
              </Button>
            ) : (
              <span />
            )}
            <Button type="submit" size="sm" loading={submitting}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        title="Remove this entry?"
        description={`${title} totals will no longer count on Reports.`}
        confirmLabel="Delete"
        destructive
        loading={submitting}
      />
    </>
  );
}
