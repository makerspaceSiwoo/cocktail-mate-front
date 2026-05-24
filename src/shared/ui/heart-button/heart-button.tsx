"use client";
import * as React from "react";
import { cn } from "@/shared/lib";
import { HeartIcon, HeartFilledIcon } from "@/shared/ui/icon";

type ButtonBase = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "onChange" | "type"
>;

export interface HeartButtonProps extends ButtonBase {
  /** REQUIRED — describes the action for screen readers (e.g. "찜하기"). */
  "aria-label": string;
  /** Controlled pressed state. Pair with onPressedChange. */
  pressed?: boolean;
  /** Uncontrolled initial state. Ignored when `pressed` is set. */
  defaultPressed?: boolean;
  /** Fires whenever the pressed state changes. */
  onPressedChange?: (pressed: boolean) => void;
  /** Icon size in px. Default 24. */
  size?: number;
}

export const HeartButton = React.forwardRef<
  HTMLButtonElement,
  HeartButtonProps
>(
  (
    {
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      size = 24,
      className,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const isControlled = pressedProp !== undefined;
    const [internal, setInternal] = React.useState(defaultPressed);
    const pressed = isControlled ? pressedProp : internal;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      const next = !pressed;
      if (!isControlled) setInternal(next);
      onPressedChange?.(next);
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={pressed}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center p-0 bg-transparent border-0",
          "transition-transform duration-150 active:scale-90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heart focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          pressed ? "text-heart" : "text-muted hover:text-text",
          className,
        )}
        {...rest}
      >
        {pressed ? (
          <HeartFilledIcon size={size} aria-hidden />
        ) : (
          <HeartIcon size={size} aria-hidden />
        )}
      </button>
    );
  },
);
HeartButton.displayName = "HeartButton";
