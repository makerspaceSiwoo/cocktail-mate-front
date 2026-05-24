"use client";

import * as React from "react";

import { cn } from "@/shared/lib";
import { HeartFilledIcon, ShareIcon } from "@/shared/ui/icon";

type ActionTone = "like" | "share";

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone: ActionTone;
  label: string;
  count?: string | number;
  "aria-label": string;
}

export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(({ tone, label, count, className, type, ...rest }, ref) => {
  const isLike = tone === "like";
  const Icon = isLike ? HeartFilledIcon : ShareIcon;
  const toneClass = isLike ? "text-heart" : "text-text";

  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={cn(
        "flex items-center justify-center gap-2 h-[50px] w-[160px] px-4 rounded-2xl bg-card-bg border border-border-soft transition-colors cursor-pointer hover:bg-chip-bg disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className,
      )}
      {...rest}
    >
      <Icon size={22} className={toneClass} />
      <span className={cn("font-bold text-[14px]", toneClass)}>{label}</span>
      {count !== undefined ? (
        <span className={cn("font-semibold text-[13px]", toneClass)}>
          {count}
        </span>
      ) : null}
    </button>
  );
});
ActionButton.displayName = "ActionButton";
