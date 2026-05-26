import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
  {
    variants: {
      variant: {
        default: "bg-chip-bg text-text",
        accent: "bg-accent text-white",
        outline: "bg-transparent text-text border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
