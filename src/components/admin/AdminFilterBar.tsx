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
import { FilterX, Search } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
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
  /** Extra query keys to keep when filters change (e.g. month/day drilldown). */
  preserveParams?: string[];
  /** Right-side actions (e.g. Add product). */
  actions?: React.ReactNode;
  /** Debounce delay for text search fields. */
  debounceMs?: number;
  className?: string;
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

function buildQueryString(
  fields: FilterField[],
  values: Record<string, string>,
  searchParams: URLSearchParams,
  preserveParams: string[],
): string {
  const params = new URLSearchParams();
  for (const field of fields) {
    const value = (values[field.name] ?? "").trim();
    if (value) {
      params.set(field.name, value);
    } else if (field.allowEmpty === false && field.defaultValue) {
      params.set(field.name, field.defaultValue);
    }
  }
  for (const key of preserveParams) {
    const value = searchParams.get(key);
    if (value && !params.has(key)) params.set(key, value);
  }
  const perPage = searchParams.get("perPage");
  if (perPage) params.set("perPage", perPage);
  return params.toString();
}

export default function AdminFilterBar({
  fields,
  preserveParams = [],
  actions,
  debounceMs = 350,
  className,
}: AdminFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const skipDebounceRef = useRef(false);

  const searchKey = searchParams.toString();
  const fieldKey = fields.map((f) => `${f.name}:${f.defaultValue ?? ""}`).join("|");

  const urlValues = useMemo(
    () => valuesFromUrl(fields, searchParams),
    // fieldKey + searchKey capture meaningful changes without unstable array identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fieldKey, searchKey],
  );

  const [values, setValues] = useState(urlValues);

  // Keep local state in sync when the URL changes (back/forward, clear, etc.).
  useEffect(() => {
    skipDebounceRef.current = true;
    setValues(urlValues);
  }, [urlValues]);

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
      const qs = buildQueryString(fields, next, searchParams, preserveParams);
      const href = qs ? `${pathname}?${qs}` : pathname;
      const current = searchParams.toString();
      if (qs === current) return;
      startTransition(() => {
        router.push(href);
      });
    },
    [fields, pathname, preserveParams, router, searchParams],
  );

  const textFields = useMemo(
    () => fields.filter((f) => (f.type ?? "text") === "text"),
    [fields],
  );

  // Debounced search: apply when text values differ from the URL.
  useEffect(() => {
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }
    if (textFields.length === 0) return;

    const timer = window.setTimeout(() => {
      const changed = textFields.some((field) => {
        const local = (values[field.name] ?? "").trim();
        const remote = (urlValues[field.name] ?? "").trim();
        return local !== remote;
      });
      if (changed) navigate(values);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [values, textFields, urlValues, navigate, debounceMs]);

  const onTextChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onImmediateChange = (name: string, value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    skipDebounceRef.current = true;
    navigate(next);
  };

  const onClear = () => {
    const empty: Record<string, string> = {};
    for (const field of fields) {
      empty[field.name] =
        field.allowEmpty === false ? (field.defaultValue ?? "") : "";
    }
    setValues(empty);
    skipDebounceRef.current = true;
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
      const perPage = searchParams.get("perPage");
      if (perPage) params.set("perPage", perPage);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  const textField = textFields[0];
  const filterFields = fields.filter((f) => f.name !== textField?.name);

  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-2.5 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-end sm:gap-2.5",
        className,
      )}
    >
      {textField && (
        <div className="w-full shrink-0 sm:max-w-sm sm:w-72">
          <Input
            label={textField.label}
            type="search"
            value={values[textField.name] ?? ""}
            onChange={(e) => onTextChange(textField.name, e.target.value)}
            placeholder={textField.placeholder ?? textField.label}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      )}

      {filterFields.length > 0 && (
        <div
          className={cn(
            "grid w-full gap-2 sm:flex sm:min-w-0 sm:flex-1 sm:flex-wrap sm:items-end sm:gap-2.5",
            filterFields.length === 1 && "grid-cols-1",
            filterFields.length === 2 && "grid-cols-2",
            filterFields.length >= 3 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {filterFields.map((field) => {
            if (field.type === "select" && field.options) {
              const allowEmpty = field.allowEmpty !== false;
              const options = allowEmpty
                ? [{ value: "", label: "All" }, ...field.options]
                : field.options;
              return (
                <div
                  key={field.name}
                  className="min-w-0 w-full sm:min-w-[9rem] sm:flex-1 sm:basis-0"
                >
                  <Select
                    label={field.label}
                    options={options}
                    value={values[field.name] ?? field.defaultValue ?? ""}
                    onChange={(value) => onImmediateChange(field.name, value)}
                    placeholder={allowEmpty ? "All" : "Select..."}
                    searchable={options.length > 8}
                  />
                </div>
              );
            }

            if (field.type === "date") {
              return (
                <div
                  key={field.name}
                  className="min-w-0 w-full sm:min-w-[9rem] sm:flex-1 sm:basis-0"
                >
                  <Input
                    label={field.label}
                    type="date"
                    value={values[field.name] ?? ""}
                    onChange={(e) =>
                      onImmediateChange(field.name, e.target.value)
                    }
                  />
                </div>
              );
            }

            return (
              <div
                key={field.name}
                className="min-w-0 w-full sm:min-w-[9rem] sm:flex-1 sm:basis-0"
              >
                <Input
                  label={field.label}
                  type="search"
                  value={values[field.name] ?? ""}
                  onChange={(e) => onTextChange(field.name, e.target.value)}
                  placeholder={field.placeholder ?? field.label}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="flex w-full shrink-0 flex-col gap-2 sm:ml-auto sm:w-auto sm:flex-row sm:items-center">
        {activeCount > 0 && (
          <Button
            type="button"
            variant="subtle"
            size="sm"
            onClick={onClear}
            disabled={pending}
            leftIcon={<FilterX className="h-4 w-4" />}
            className="h-11 w-full sm:w-auto"
          >
            Clear
          </Button>
        )}
        {actions ? (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center [&_a]:w-full [&_button]:w-full sm:[&_a]:w-auto sm:[&_button]:w-auto">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
