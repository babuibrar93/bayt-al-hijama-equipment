"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/classes";

export default function StockEditor({
  id,
  initialStock,
}: {
  id: string;
  initialStock: number;
}) {
  const router = useRouter();
  const [stock, setStock] = useState(String(initialStock));
  const [loading, setLoading] = useState(false);

  const dirty = Number(stock) !== initialStock;

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: Number(stock) }),
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
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="w-20 rounded-sm border border-glass-border bg-black/30 px-3 py-1.5 text-sm text-white focus:border-gold/50 focus:outline-none"
      />
      <button
        type="button"
        onClick={save}
        disabled={!dirty || loading}
        aria-label="Save stock"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-sm border transition-colors",
          dirty
            ? "border-gold/40 text-gold hover:bg-gold/10"
            : "border-glass-border text-white/30",
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
