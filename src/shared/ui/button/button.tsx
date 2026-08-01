"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white hover:opacity-90 active:opacity-80",
        secondary: "bg-card-bg text-text border border-border hover:bg-chip-bg",
        ghost: "bg-transparent text-text hover:bg-chip-bg",
        // No chip background — just the icon/text in the parent surface.
        // Use with IconButton for the like/favorite toggle pattern.
        naked: "bg-transparent border-0 p-0 text-text hover:opacity-80 active:scale-90",
        cta: "bg-text text-bg hover:opacity-90 active:opacity-80 font-bold tracking-[-0.01em]",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-base",
        lg: "h-12 px-5 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
