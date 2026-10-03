"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { cn } from "@/lib/classes";

export default function StockEditor({
  id,
  initialStock,
}: {
  id: string;
  initialStock: number;
}) {
  const router = useRouter();
  const [stock, setStock] = useState(initialStock);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStock(initialStock);
  }, [initialStock]);

  const dirty = stock !== initialStock;

  const bump = (delta: number) => {
    setStock((current) => Math.max(0, current + delta));
  };

  const save = async () => {
    if (!dirty || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock }),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Update failed");
      }
      toast.success("Stock updated");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-start gap-1.5 sm:justify-end sm:gap-2">
      <div className="inline-flex items-center rounded-md border border-glass-border bg-black/30">
        <button
          type="button"
          onClick={() => bump(-1)}
          disabled={loading || stock <= 0}
          aria-label="Decrease stock"
          className="inline-flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40 sm:h-9 sm:w-9"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="number"
          min={0}
          step={1}
          value={stock}
          onChange={(e) => {
            const next = Number(e.target.value);
            setStock(Number.isFinite(next) ? Math.max(0, Math.floor(next)) : 0);
          }}
          aria-label="Stock quantity"
          className={cn(
            "h-8 w-12 border-x border-glass-border bg-transparent text-center text-sm text-white sm:h-9 sm:w-14",
            "focus:outline-none [appearance:textfield]",
            "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          )}
        />
        <button
          type="button"
          onClick={() => bump(1)}
          disabled={loading}
          aria-label="Increase stock"
          className="inline-flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40 sm:h-9 sm:w-9"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <Button
        type="button"
        size="sm"
        variant={dirty ? "primary" : "subtle"}
        onClick={save}
        loading={loading}
        disabled={!dirty || loading}
      >
        Update
      </Button>
    </div>
  );
}
