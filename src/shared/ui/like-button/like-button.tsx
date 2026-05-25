"use client";

import * as React from "react";

import { cn } from "@/shared/lib";
import { HeartFilledIcon, HeartIcon } from "@/shared/ui/icon";

type ButtonBase = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "type" | "children"
>;

export interface LikeButtonProps extends ButtonBase {
  /** REQUIRED — screen-reader label (e.g. "찜하기"). */
  "aria-label": string;
  /**
   * State of the button. When true the filled heart is rendered with the
   * `--color-heart` token; when false the outline heart with `text-muted`.
   * Always controlled — parent owns the value and toggles it via onClick.
   */
  isLiked: boolean;
  /** Icon size in px. Default 24. */
  size?: number;
}

export const LikeButton = React.forwardRef<HTMLButtonElement, LikeButtonProps>(
  ({ isLiked, size = 24, className, ...rest }, ref) => {
    const Icon = isLiked ? HeartFilledIcon : HeartIcon;
    const colorClass = isLiked ? "text-heart" : "text-muted hover:text-text";

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isLiked}
        className={cn(
          "inline-flex items-center justify-center p-0 bg-transparent border-0",
          "transition-transform duration-150 cursor-pointer active:scale-90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heart focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          colorClass,
          className,
        )}
        {...rest}
      >
        <Icon size={size} aria-hidden />
      </button>
    );
  },
);
LikeButton.displayName = "LikeButton";
