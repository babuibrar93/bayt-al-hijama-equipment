"use client";

import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { cn, fieldBorder, fieldBorderError } from "@/lib/classes";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    type = "text",
    required,
    className,
    containerClassName,
    id,
    value,
    defaultValue,
    onChange,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [show, setShow] = useState(false);

  const isPassword = type === "password";
  const isSearch = type === "search";
  const isDate = type === "date" || type === "datetime-local" || type === "time";
  const resolvedType = isPassword ? (show ? "text" : "password") : type;

  const resolvedValue = value ?? defaultValue;
  const hasSearchValue =
    isSearch &&
    resolvedValue != null &&
    String(resolvedValue).length > 0;

  const clearSearch = () => {
    if (!onChange) return;
    const target = { value: "" } as HTMLInputElement;
    onChange({
      target,
      currentTarget: target,
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-white/70">
          {label}
          {required && <span className="text-gold"> *</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 text-white/40">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          className={cn(
            "h-11 w-full rounded-md border bg-black/30 px-3.5 text-sm text-white placeholder:text-white/30 transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-55",
            leftIcon && "pl-10",
            (isPassword || hasSearchValue) && "pr-11",
            isDate && "date-input pr-3 [color-scheme:dark]",
            error ? fieldBorderError : fieldBorder,
            className,
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        {hasSearchValue && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {error ? (
        <span className="text-xs text-red-400">{error}</span>
      ) : hint ? (
        <span className="text-xs text-white/40">{hint}</span>
      ) : null}
    </div>
  );
});

export default Input;
