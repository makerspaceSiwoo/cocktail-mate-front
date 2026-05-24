"use client";

import * as React from "react";

import { cn } from "@/shared/lib";

export interface CategoryChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const CategoryChip = React.forwardRef<
  HTMLButtonElement,
  CategoryChipProps
>(({ active = false, className, type, children, ...rest }, ref) => {
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center px-4 py-2 rounded-full font-bold text-[13px] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        active
          ? "bg-text text-bg"
          : "bg-card-bg text-text border border-border",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
CategoryChip.displayName = "CategoryChip";
