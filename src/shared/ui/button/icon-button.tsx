"use client";

import * as React from "react";

import { cn } from "@/shared/lib";

import { Button, type ButtonProps } from "./button";

type Base = Omit<ButtonProps, "children" | "size" | "fullWidth" | "onChange">;

export interface IconButtonProps extends Base {
  /** Icon element rendered in the inactive (or only) state. */
  icon: React.ReactNode;
  /** Optional icon rendered when `pressed` is true. Falls back to `icon`. */
  pressedIcon?: React.ReactNode;
  /** REQUIRED — screen-reader label (e.g. "찜하기", "설정"). */
  "aria-label": string;
  size?: "sm" | "md" | "lg";
  /** Controlled toggle state. When set, IconButton acts as a toggle and wires `aria-pressed`. */
  pressed?: boolean;
  /** Uncontrolled initial toggle state. */
  defaultPressed?: boolean;
  /** Fires whenever the pressed state changes. */
  onPressedChange?: (pressed: boolean) => void;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      pressedIcon,
      className,
      size = "md",
      variant,
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      onClick,
      ...rest
    },
    ref,
  ) => {
    // Toggle behavior is opt-in: any pressed-related prop turns it on.
    const isToggle =
      pressedProp !== undefined ||
      defaultPressed !== false ||
      onPressedChange !== undefined ||
      pressedIcon !== undefined;
    const isControlled = pressedProp !== undefined;

    const [internal, setInternal] = React.useState(defaultPressed);
    const pressed = isControlled ? pressedProp : internal;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!isToggle || e.defaultPrevented) return;
      const next = !pressed;
      if (!isControlled) setInternal(next);
      onPressedChange?.(next);
    };

    // Naked variant skips the chip padding; the icon sits in its natural box.
    // All other variants get the square dimensions for a consistent tap target.
    const sizeClass =
      variant === "naked"
        ? ""
        : size === "sm"
          ? "h-9 w-9 p-0"
          : size === "lg"
            ? "h-12 w-12 p-0"
            : "h-11 w-11 p-0";

    return (
      <Button
        ref={ref}
        variant={variant}
        aria-pressed={isToggle ? pressed : undefined}
        onClick={handleClick}
        className={cn(sizeClass, className)}
        {...rest}
      >
        {pressed && pressedIcon ? pressedIcon : icon}
      </Button>
    );
  },
);
IconButton.displayName = "IconButton";
