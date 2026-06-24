"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/classes";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  searchable?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  className?: string;
}

export default function Select({
  options,
  value,
  onChange,
  label,
  placeholder = "Select...",
  error,
  searchable = true,
  disabled,
  containerClassName,
  className,
}: SelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!searchable || !query) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
    if (!open) setQuery("");
  }, [open, searchable]);

  const choose = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && open && filtered[activeIndex]) {
      e.preventDefault();
      choose(filtered[activeIndex].value);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)} ref={containerRef}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-2 rounded-md border bg-black/30 px-3.5 text-left text-sm transition-colors focus:outline-none disabled:opacity-50",
            error
              ? "border-red-500/50"
              : "border-glass-border focus:border-gold/50",
            className,
          )}
        >
          <span className={cn("truncate", selected ? "text-white" : "text-white/40")}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-white/40 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-md border border-glass-border bg-black-3 shadow-xl">
            {searchable && (
              <div className="relative border-b border-glass-border p-2">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Search..."
                  className="w-full rounded-sm bg-transparent py-1.5 pl-7 pr-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
            )}
            <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-3.5 py-2 text-sm text-white/40">No results</li>
              ) : (
                filtered.map((option, index) => {
                  const isSelected = option.value === value;
                  return (
                    <li key={option.value} role="option" aria-selected={isSelected}>
                      <button
                        type="button"
                        onClick={() => choose(option.value)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-sm transition-colors",
                          index === activeIndex
                            ? "bg-white/5 text-white"
                            : "text-white/70",
                        )}
                      >
                        <span className="truncate">{option.label}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 shrink-0 text-gold" />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
