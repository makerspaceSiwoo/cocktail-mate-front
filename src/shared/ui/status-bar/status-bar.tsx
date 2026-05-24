import * as React from "react";

import { cn } from "@/shared/lib";

export interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  time?: string;
}

export function StatusBar({
  time = "9:41",
  className,
  ...rest
}: StatusBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between h-[38px] w-[375px] px-[22px] pt-[14px] pb-[4px] bg-bg",
        className,
      )}
      {...rest}
    >
      <span className="font-semibold text-sm text-text">{time}</span>
      <div className="flex items-center gap-1.5 text-text">
        {/* Signal bars */}
        <svg
          width="17"
          height="11"
          viewBox="0 0 17 11"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect x="0" y="7" width="3" height="4" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.5" />
          <rect x="9" y="3" width="3" height="8" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" />
        </svg>
        {/* Wifi */}
        <svg
          width="15"
          height="11"
          viewBox="0 0 15 11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M1 4.2a10 10 0 0113 0" />
          <path d="M3.2 6.6a6.5 6.5 0 018.6 0" />
          <circle cx="7.5" cy="9.2" r="0.9" fill="currentColor" />
        </svg>
        {/* Battery */}
        <svg
          width="24"
          height="11"
          viewBox="0 0 24 11"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="0.5"
            y="0.5"
            width="21"
            height="10"
            rx="2.5"
            stroke="currentColor"
            strokeOpacity="0.35"
          />
          <rect x="2" y="2" width="18" height="7" rx="1.2" fill="currentColor" />
          <rect
            x="22.5"
            y="3.5"
            width="1.2"
            height="4"
            rx="0.6"
            fill="currentColor"
            opacity="0.35"
          />
        </svg>
      </div>
    </div>
  );
}
