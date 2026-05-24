import * as React from "react";

import { cn } from "@/shared/lib";

export interface OrDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function OrDivider({
  label = "OR",
  className,
  ...rest
}: OrDividerProps) {
  return (
    <div
      className={cn("flex items-center gap-3 h-[14px] w-full", className)}
      {...rest}
    >
      <span className="flex-1 h-px bg-border" />
      <span className="text-[11px] text-muted tracking-[0.88px] font-normal">
        {label}
      </span>
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}
