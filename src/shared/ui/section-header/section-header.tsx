"use client";

import * as React from "react";

import { cn } from "@/shared/lib";
import { ChevronRightIcon } from "@/shared/ui/icon";

export interface SectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
  className,
  ...rest
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between h-9 px-[22px] py-1.5 bg-bg w-full",
        className,
      )}
      {...rest}
    >
      <h2 className="font-bold text-[16px] text-text tracking-[-0.32px]">
        {title}
      </h2>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-[2px] text-[12px] text-muted hover:text-text transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          {actionLabel}
          <ChevronRightIcon size={12} />
        </button>
      ) : null}
    </div>
  );
}
