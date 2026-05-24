import * as React from "react";

import { cn } from "@/shared/lib";

export interface StepIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  current: number;
  total?: number;
}

export function StepIndicator({
  current,
  total = 3,
  className,
  ...rest
}: StepIndicatorProps) {
  return (
    <div
      className={cn("flex gap-1.5 h-[3px] w-full", className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      {...rest}
    >
      {Array.from({ length: total }, (_, i) => {
        const isActive = i + 1 <= current;
        return (
          <span
            key={i}
            className={cn(
              "flex-1 h-[3px] rounded-full",
              isActive ? "bg-accent" : "bg-border",
            )}
          />
        );
      })}
    </div>
  );
}
