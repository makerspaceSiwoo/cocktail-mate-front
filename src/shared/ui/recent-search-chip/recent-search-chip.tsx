"use client";

import * as React from "react";

import { cn } from "@/shared/lib";
import { CloseIcon } from "@/shared/ui/icon";

export interface RecentSearchChipProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  onRemove?: () => void;
}

export function RecentSearchChip({
  label,
  onRemove,
  className,
  ...rest
}: RecentSearchChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg border border-border text-[12px] text-text",
        className,
      )}
      {...rest}
    >
      <span>{label}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label="검색어 삭제"
          onClick={onRemove}
          className="inline-flex items-center justify-center text-muted hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
        >
          <CloseIcon size={11} />
        </button>
      ) : null}
    </div>
  );
}
