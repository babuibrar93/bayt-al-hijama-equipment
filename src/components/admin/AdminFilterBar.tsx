"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ListFilter, Search } from "lucide-react";
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

const DEBOUNCE_MS = 350;

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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const urlValues = useMemo(() => {
    const next: Record<string, string> = {};
    for (const field of fields) {
      next[field.name] =
        searchParams.get(field.name) ?? field.defaultValue ?? "";
    }
    return next;
  }, [fields, searchParams]);

  const [values, setValues] = useState(urlValues);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  useEffect(() => {
    setValues((prev) => {
      const next = { ...urlValues };
      for (const field of fields) {
        const isText = !field.type || field.type === "text";
        if (
          isText &&
          debounceRef.current &&
          prev[field.name] !== urlValues[field.name]
        ) {
          next[field.name] = prev[field.name] ?? "";
        }
      }
      valuesRef.current = next;
      return next;
    });
  }, [urlValues, fields]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const activeCount = useMemo(() => {
    return fields.reduce((count, field) => {
      const raw = searchParams.get(field.name)?.trim() ?? "";
      if (!raw) return count;
      if (field.allowEmpty === false && raw === field.defaultValue) return count;
      return count + 1;
    }, 0);
  }, [fields, searchParams]);

  const navigate = useCallback(
    (next: Record<string, string>) => {
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
      startTransition(() => {
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [fields, pathname, preserveParams, router, searchParams],
  );

  const applyImmediate = (name: string, value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    const next = { ...valuesRef.current, [name]: value };
    valuesRef.current = next;
    setValues(next);
    navigate(next);
  };

  const applyDebounced = (name: string, value: string) => {
    const next = { ...valuesRef.current, [name]: value };
    valuesRef.current = next;
    setValues(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate(valuesRef.current);
    }, DEBOUNCE_MS);
  };

  const onClear = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    const empty: Record<string, string> = {};
    for (const field of fields) {
      empty[field.name] =
        field.allowEmpty === false ? (field.defaultValue ?? "") : "";
    }
    valuesRef.current = empty;
    setValues(empty);
    startTransition(() => router.push(pathname));
  };

  const hasClearable = fields.some((field) => {
    const raw = searchParams.get(field.name);
    if (!raw) return false;
    if (field.allowEmpty === false && raw === field.defaultValue) return false;
    return true;
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={activeCount ? `Filters (${activeCount} active)` : "Filters"}
        className={cn(
          "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
          "bg-white/10 text-white transition-colors hover:bg-white/15 hover:text-white",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        )}
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
              disabled={!hasClearable && !pending}
            >
              Clear
            </Button>
            <Button
              type="button"
              size="md"
              onClick={() => setOpen(false)}
              loading={pending}
            >
              Done
            </Button>
          </>
        }
      >
        <div className={cn("flex flex-col gap-4", pending && "opacity-80")}>
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
                  value={values[field.name] ?? field.defaultValue ?? ""}
                  onChange={(value) => applyImmediate(field.name, value)}
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
                  value={values[field.name] ?? ""}
                  onChange={(e) => applyImmediate(field.name, e.target.value)}
                />
              );
            }

            return (
              <Input
                key={field.name}
                label={field.label}
                type="text"
                value={values[field.name] ?? ""}
                onChange={(e) => applyDebounced(field.name, e.target.value)}
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
