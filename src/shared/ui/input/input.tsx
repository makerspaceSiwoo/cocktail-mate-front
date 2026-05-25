"use client";

import * as React from "react";

import { cn } from "@/shared/lib";
import { CloseIcon } from "@/shared/ui/icon";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: boolean;
  shape?: "rounded" | "pill";
  /**
   * Show a clear (×) button when the input has text. Click to reset the
   * value to "". Works for controlled and uncontrolled inputs. Default true.
   */
  clearable?: boolean;
  /** Optional callback fired after the clear button resets the value. */
  onClear?: () => void;
}

const baseClasses =
  "block w-full h-11 pl-4 text-base text-text placeholder:text-muted bg-search-bg border border-border cursor-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

const errorClasses = "border-heart focus-visible:ring-heart";

// React patches the native `value` setter on inputs so it can track
// controlled-component state. To programmatically clear a controlled
// input (so the consumer's onChange fires with ""), call the original
// native setter and then dispatch an "input" event for React to pick up.
function setNativeValue(input: HTMLInputElement, value: string) {
  const proto = Object.getPrototypeOf(input);
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      error = false,
      shape = "rounded",
      clearable = true,
      onClear,
      defaultValue,
      value,
      onChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    React.useImperativeHandle(
      ref,
      () => innerRef.current as HTMLInputElement,
      [],
    );

    const isControlled = value !== undefined;
    const initialHasText = Boolean(
      isControlled
        ? String(value ?? "").length
        : String(defaultValue ?? "").length,
    );
    const [hasText, setHasText] = React.useState(initialHasText);

    React.useEffect(() => {
      if (isControlled) {
        setHasText(String(value ?? "").length > 0);
      }
    }, [isControlled, value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setHasText(e.target.value.length > 0);
      onChange?.(e);
    };

    const handleClear = () => {
      const input = innerRef.current;
      if (!input) return;
      setNativeValue(input, "");
      if (!isControlled) setHasText(false);
      input.focus();
      onClear?.();
    };

    const shapeClass = shape === "pill" ? "rounded-full" : "rounded-xl";
    const showClear = clearable && hasText && !disabled;

    return (
      <div className="relative w-full">
        <input
          ref={innerRef}
          value={value as string | number | readonly string[] | undefined}
          defaultValue={defaultValue}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            baseClasses,
            shapeClass,
            // Reserve room for the X button only when it might appear,
            // otherwise pr-4 keeps the input visually balanced.
            clearable ? "pr-10" : "pr-4",
            error && errorClasses,
            className,
          )}
          {...props}
        />
        {showClear ? (
          <button
            type="button"
            aria-label="입력 내용 지우기"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center size-7 rounded-full text-muted cursor-pointer hover:text-text hover:bg-chip-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <CloseIcon size={14} aria-hidden />
          </button>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
