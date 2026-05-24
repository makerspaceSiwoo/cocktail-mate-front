"use client";

import * as React from "react";

import { cn } from "@/shared/lib";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  shape?: "rounded" | "pill";
}

const baseClasses =
  "block w-full h-11 px-4 text-base text-text placeholder:text-muted bg-search-bg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

const errorClasses = "border-heart focus-visible:ring-heart";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      leftIcon,
      rightIcon,
      error = false,
      shape = "rounded",
      ...props
    },
    ref,
  ) => {
    const shapeClass = shape === "pill" ? "rounded-full" : "rounded-xl";
    return (
      <div className="relative w-full">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted flex items-center">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            baseClasses,
            shapeClass,
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && errorClasses,
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted flex items-center">
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
