"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";

import { cn } from "@/shared/lib";

type CheckboxShape = "square" | "round";

export interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> {
  shape?: CheckboxShape;
  size?: number;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ shape = "square", size = 18, className, style, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "border-text data-[state=checked]:bg-text focus-visible:ring-accent focus-visible:ring-offset-bg inline-flex shrink-0 cursor-pointer items-center justify-center border-[1.5px] bg-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        shape === "round" ? "rounded-full" : "rounded-[5px]",
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="text-bg flex items-center justify-center">
        <svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2 6l2.2 2.2L9 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = "Checkbox";
