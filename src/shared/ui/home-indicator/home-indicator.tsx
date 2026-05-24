import * as React from "react";

import { cn } from "@/shared/lib";

export type HomeIndicatorProps = React.HTMLAttributes<HTMLDivElement>;

export function HomeIndicator({ className, ...rest }: HomeIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-[22px] w-[375px] pt-[8px] pb-[10px] bg-bg",
        className,
      )}
      {...rest}
    >
      <div className="h-1 w-[134px] rounded-full bg-text" />
    </div>
  );
}
