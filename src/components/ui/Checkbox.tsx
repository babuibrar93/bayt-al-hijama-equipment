"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/classes";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, id, ...rest },
  ref,
) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className="flex cursor-pointer items-start gap-2.5 text-sm text-white/75"
    >
      <input
        ref={ref}
        id={checkboxId}
        type="checkbox"
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0 accent-gold",
          className,
        )}
        {...rest}
      />
      <span className="flex flex-col">
        {label && <span>{label}</span>}
        {description && (
          <span className="text-xs text-white/45">{description}</span>
        )}
      </span>
    </label>
  );
});

export default Checkbox;
