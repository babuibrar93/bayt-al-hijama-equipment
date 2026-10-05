"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, Search } from "lucide-react";
import { cn, fieldBorder, fieldBorderError } from "@/lib/classes";

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

interface MenuPos {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: "bottom" | "top";
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
  const [menuPos, setMenuPos] = useState<MenuPos | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!searchable || !query) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  const updateMenuPos = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const gap = 6;
    const estimated = Math.min(280, 16 + filtered.length * 40 + (searchable ? 48 : 0));
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const placement =
      spaceBelow < Math.min(estimated, 160) && spaceAbove > spaceBelow
        ? "top"
        : "bottom";
    const maxHeight =
      placement === "bottom"
        ? Math.max(120, Math.min(224, spaceBelow))
        : Math.max(120, Math.min(224, spaceAbove));

    setMenuPos({
      top: placement === "bottom" ? rect.bottom + gap : rect.top - gap,
      left: rect.left,
      width: rect.width,
      maxHeight,
      placement,
    });
  };

  useLayoutEffect(() => {
    if (!open) {
      setMenuPos(null);
      return;
    }
    updateMenuPos();
    const onReposition = () => updateMenuPos();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reposition when open/options change
  }, [open, filtered.length, searchable]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
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
    if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
      return;
    }
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

  const menu =
    open &&
    menuPos &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        ref={menuRef}
        className={cn(
          "z-[220] overflow-hidden rounded-md border bg-black-3 shadow-xl",
          fieldBorder,
        )}
        style={{
          position: "fixed",
          left: menuPos.left,
          width: menuPos.width,
          maxHeight: menuPos.maxHeight,
          top: menuPos.placement === "bottom" ? menuPos.top : undefined,
          bottom:
            menuPos.placement === "top"
              ? window.innerHeight - menuPos.top
              : undefined,
        }}
      >
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
        <ul
          role="listbox"
          className="overflow-y-auto py-1"
          style={{ maxHeight: searchable ? menuPos.maxHeight - 48 : menuPos.maxHeight }}
        >
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
      </div>,
      document.body,
    );

  return (
    <div
      className={cn("flex flex-col gap-1.5", containerClassName)}
      ref={containerRef}
    >
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex h-11 w-full items-center gap-2 rounded-md border border-solid bg-black/30 py-0 pl-3.5 pr-3 text-left text-sm transition-colors focus:outline-none disabled:opacity-50",
            error ? fieldBorderError : fieldBorder,
            className,
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              selected ? "text-white" : "text-white/40",
            )}
          >
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown
            className={cn(
              "pointer-events-none h-4 w-4 shrink-0 text-white/50 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
        {menu}
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
