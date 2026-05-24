import * as React from "react";

import { cn } from "@/shared/lib";

export interface CocktailDiscProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  /** CSS color value used as the disc background (caller-supplied). */
  color: string;
  size?: "sm" | "lg";
}

export function CocktailDisc({
  name,
  color,
  size = "sm",
  className,
  ...rest
}: CocktailDiscProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-1",
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          "rounded-full",
          size === "lg" ? "size-[88px]" : "size-[64px]",
        )}
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="font-medium text-[11px] text-text whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}
