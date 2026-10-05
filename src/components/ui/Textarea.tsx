"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";
import { cn, fieldBorder, fieldBorderError } from "@/lib/classes";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  /** Grow height with content (min height from `rows`). */
  autoGrow?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      error,
      hint,
      required,
      className,
      containerClassName,
      id,
      rows = 4,
      autoGrow = false,
      value,
      defaultValue,
      onChange,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const resize = useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoGrow) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoGrow]);

    useEffect(() => {
      resize();
    }, [resize, value, defaultValue]);

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-white/70"
          >
            {label}
            {required && <span className="text-gold"> *</span>}
          </label>
        )}
        <textarea
          ref={setRefs}
          id={textareaId}
          rows={rows}
          required={required}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          onChange={(e) => {
            onChange?.(e);
            if (autoGrow) {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }
          }}
          className={cn(
            "w-full rounded-md border bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors focus:outline-none",
            autoGrow ? "resize-none overflow-hidden" : "resize-none",
            error ? fieldBorderError : fieldBorder,
            className,
          )}
          {...rest}
        />
        {error ? (
          <span className="text-xs text-red-400">{error}</span>
        ) : hint ? (
          <span className="text-xs text-white/40">{hint}</span>
        ) : null}
      </div>
    );
  },
);

export default Textarea;
