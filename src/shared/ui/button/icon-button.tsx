"use client";

import * as React from "react";

import { cn } from "@/shared/lib";

import { Button, type ButtonProps } from "./button";

type Base = Omit<ButtonProps, "children" | "size" | "fullWidth">;

export interface IconButtonProps extends Base {
  /** Icon element rendered inside the button. */
  icon: React.ReactNode;
  /** REQUIRED — screen-reader label (e.g. "설정", "닫기"). */
  "aria-label": string;
  size?: "sm" | "md" | "lg";
  /**
   * When true, the icon rotates 180° on hover and on touch/active.
   * Useful for affordances like the settings cog. Default false.
   */
  rotate?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = "md", variant, rotate = false, ...rest }, ref) => {
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

    const content = rotate ? (
      <span
        aria-hidden
        className="inline-flex items-center justify-center transition-transform duration-300 ease-out group-hover:rotate-180 group-focus-visible:rotate-180 group-active:rotate-180"
      >
        {icon}
      </span>
    ) : (
      icon
    );

    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(sizeClass, rotate && "group", className)}
        {...rest}
      >
        {content}
      </Button>
    );
  },
);
IconButton.displayName = "IconButton";
