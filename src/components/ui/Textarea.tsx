"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/classes";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, error, hint, required, className, containerClassName, id, rows = 4, ...rest },
    ref,
  ) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-white/70">
            {label}
            {required && <span className="text-gold"> *</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          className={cn(
            "w-full resize-none rounded-md border bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors focus:outline-none",
            error
              ? "border-red-500/50 focus:border-red-500/70"
              : "border-glass-border focus:border-gold/50",
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
