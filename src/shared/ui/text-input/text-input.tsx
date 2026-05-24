"use client";

import * as React from "react";

import { cn } from "@/shared/lib";
import { EyeIcon, EyeOffIcon } from "@/shared/ui/icon";

type TextInputType = "text" | "email" | "password";

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  type?: TextInputType;
  error?: boolean;
}

const baseInputClasses =
  "flex w-full h-12 px-4 py-3.5 rounded-xl bg-card-bg border border-border text-[14px] text-text placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

const errorClass = "border-heart focus-visible:ring-heart";

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ type = "text", error = false, className, disabled, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);

    if (type === "password") {
      const effectiveType = visible ? "text" : "password";
      return (
        <div
          className={cn(
            "flex h-12 w-full items-center gap-2 rounded-xl bg-card-bg border border-border pl-4 pr-2 transition-colors focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-bg",
            error && "border-heart focus-within:ring-heart",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
        >
          <input
            ref={ref}
            type={effectiveType}
            disabled={disabled}
            className="flex-1 h-full bg-transparent border-0 outline-none focus-visible:outline-none focus-visible:ring-0 px-0 py-0 text-[14px] text-text placeholder:text-muted disabled:cursor-not-allowed"
            {...props}
          />
          <button
            type="button"
            aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
            disabled={disabled}
            className="inline-flex items-center justify-center h-8 w-8 rounded-full text-muted hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed"
          >
            {visible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
      );
    }

    return (
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(baseInputClasses, error && errorClass, className)}
        {...props}
      />
    );
  },
);
TextInput.displayName = "TextInput";
