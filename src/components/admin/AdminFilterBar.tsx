"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FilterX, ListFilter, Search } from "lucide-react";
import { Button, Input, Modal, Select } from "@/components/ui";
import { cn } from "@/lib/classes";

export interface FilterField {
  name: string;
  label: string;
  type?: "text" | "select" | "date";
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** Shown when the query param is missing. */
  defaultValue?: string;
  /** When false, omit the empty “All” option (required filters). Default true. */
  allowEmpty?: boolean;
}

interface AdminFilterBarProps {
  fields: FilterField[];
  title?: string;
  /** Extra query keys to keep when filters change (e.g. month/day drilldown). */
  preserveParams?: string[];
}

function valuesFromUrl(
  fields: FilterField[],
  searchParams: URLSearchParams,
): Record<string, string> {
  const next: Record<string, string> = {};
  for (const field of fields) {
    next[field.name] =
      searchParams.get(field.name) ?? field.defaultValue ?? "";
  }
  return next;
}

export default function AdminFilterBar({
  fields,
  title = "Filters",
  preserveParams = [],
}: AdminFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const urlValues = useMemo(
    () => valuesFromUrl(fields, searchParams),
    [fields, searchParams],
  );

  const [draft, setDraft] = useState(urlValues);

  useEffect(() => {
    if (!open) setDraft(urlValues);
  }, [urlValues, open]);

  const activeCount = useMemo(() => {
    return fields.reduce((count, field) => {
      const raw = searchParams.get(field.name)?.trim() ?? "";
      if (!raw) return count;
      if (field.allowEmpty === false && raw === field.defaultValue) return count;
      return count + 1;
    }, 0);
  }, [fields, searchParams]);

  const setField = (name: string, value: string) => {
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = (next: Record<string, string>) => {
    const params = new URLSearchParams();
    for (const field of fields) {
      const value = (next[field.name] ?? "").trim();
      if (value) params.set(field.name, value);
    }
    for (const key of preserveParams) {
      const value = searchParams.get(key);
      if (value && !params.has(key)) params.set(key, value);
    }
    const perPage = searchParams.get("perPage");
    if (perPage) params.set("perPage", perPage);
    // year is preserved on reports via fields; keep page reset on filter apply
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  const onClear = () => {
    const empty: Record<string, string> = {};
    for (const field of fields) {
      empty[field.name] =
        field.allowEmpty === false ? (field.defaultValue ?? "") : "";
    }
    setDraft(empty);
    startTransition(() => {
      const params = new URLSearchParams();
      for (const field of fields) {
        if (field.allowEmpty === false && field.defaultValue) {
          params.set(field.name, field.defaultValue);
        }
      }
      for (const key of preserveParams) {
        const value = searchParams.get(key);
        if (value) params.set(key, value);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
      setOpen(false);
    });
  };

  const onDone = () => {
    navigate(draft);
    setOpen(false);
  };

  const hasDraftClearable = fields.some((field) => {
    const raw = draft[field.name]?.trim() ?? "";
    if (!raw) return false;
    if (field.allowEmpty === false && raw === field.defaultValue) return false;
    return true;
  });

  const iconBtnClass = cn(
    "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
    "bg-white/10 text-white transition-colors hover:bg-white/15 hover:text-white",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
    "disabled:pointer-events-none disabled:opacity-50",
  );

  return (
    <>
      <div className="flex items-center gap-1.5">
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            disabled={pending}
            aria-label="Clear filters"
            title="Clear filters"
            className={iconBtnClass}
          >
            <FilterX className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setDraft(urlValues);
            setOpen(true);
          }}
          aria-label={
            activeCount ? `Filters (${activeCount} active)` : "Filters"
          }
          className={iconBtnClass}
        >
          <ListFilter className="h-4 w-4" aria-hidden="true" />
          {activeCount > 0 && (
            <span
              className={cn(
                "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1",
                "text-[0.65rem] font-semibold leading-none text-black",
              )}
            >
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        size="md"
        className="overflow-visible"
        footer={
          <>
            <Button
              type="button"
              variant="subtle"
              size="md"
              onClick={onClear}
              disabled={!hasDraftClearable || pending}
            >
              Clear
            </Button>
            <Button
              type="button"
              size="md"
              onClick={onDone}
              loading={pending}
            >
              Done
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {fields.map((field) => {
            if (field.type === "select" && field.options) {
              const allowEmpty = field.allowEmpty !== false;
              const options = allowEmpty
                ? [{ value: "", label: "All" }, ...field.options]
                : field.options;
              return (
                <Select
                  key={field.name}
                  label={field.label}
                  options={options}
                  value={draft[field.name] ?? field.defaultValue ?? ""}
                  onChange={(value) => setField(field.name, value)}
                  placeholder={allowEmpty ? "All" : "Select..."}
                  searchable={options.length > 8}
                />
              );
            }

            if (field.type === "date") {
              return (
                <Input
                  key={field.name}
                  label={field.label}
                  type="date"
                  value={draft[field.name] ?? ""}
                  onChange={(e) => setField(field.name, e.target.value)}
                />
              );
            }

            return (
              <Input
                key={field.name}
                label={field.label}
                type="text"
                value={draft[field.name] ?? ""}
                onChange={(e) => setField(field.name, e.target.value)}
                placeholder={field.placeholder}
                leftIcon={<Search className="h-4 w-4" />}
              />
            );
          })}
        </div>
      </Modal>
    </>
  );
}
