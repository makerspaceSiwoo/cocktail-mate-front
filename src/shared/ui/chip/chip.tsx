"use client";

import * as React from "react";

import { cn } from "@/shared/lib";
import { CloseIcon } from "@/shared/ui/icon";

type ButtonBase = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
>;

export interface ChipProps extends ButtonBase {
  /** Visible label. */
  label: string;
  /**
   * Active visual state — when true the chip uses bg-text + text-bg.
   * Default false.
   */
  active?: boolean;
  /**
   * When provided, the chip renders an X (remove) button on its trailing
   * edge. Clicking it fires only onRemove (it does not call onClick).
   */
  onRemove?: () => void;
  /** aria-label for the remove button. Default "삭제". */
  removeLabel?: string;
}

// Two adjacent buttons inside a flex container — avoids the invalid
// "button-in-button" pattern while still keeping a single visual pill.
export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      label,
      active = false,
      onRemove,
      removeLabel = "삭제",
      className,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const containerClass = cn(
      "inline-flex items-center rounded-full font-medium text-[13px] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-bg",
      active
        ? "bg-text text-bg"
        : "bg-card-bg text-text border border-border hover:bg-chip-bg",
      className,
    );

    const labelButton = (
      <button
        ref={ref}
        type="button"
        aria-pressed={active}
        disabled={disabled}
        className={cn(
          "inline-flex items-center cursor-pointer focus-visible:outline-none disabled:cursor-not-allowed",
          // Square the inner label area; when there's no remove button it
          // owns the whole pill, otherwise leaves room for the X.
          onRemove ? "pl-3.5 pr-2 py-1.5 rounded-l-full" : "px-4 py-2 rounded-full",
        )}
        {...rest}
      >
        {label}
      </button>
    );

    if (!onRemove) {
      // Single button — the labelButton itself is the chip. Apply the
      // container styling directly to it via a wrapper-less render.
      return (
        <button
          ref={ref}
          type="button"
          aria-pressed={active}
          disabled={disabled}
          className={cn(
            "inline-flex items-center px-4 py-2 rounded-full font-medium text-[13px] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            active
              ? "bg-text text-bg"
              : "bg-card-bg text-text border border-border hover:bg-chip-bg",
            className,
          )}
          {...rest}
        >
          {label}
        </button>
      );
    }

    return (
      <span className={containerClass}>
        {labelButton}
        <button
          type="button"
          aria-label={removeLabel}
          disabled={disabled}
          onClick={(e) => {
            // Even though the two buttons are siblings, defensive stop
            // ensures the chip's onClick can never receive this event via
            // bubbling through a future composition.
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            "inline-flex items-center justify-center size-6 mr-1 rounded-full cursor-pointer transition-colors focus-visible:outline-none disabled:cursor-not-allowed",
            active
              ? "text-bg hover:bg-white/15"
              : "text-muted hover:bg-chip-bg hover:text-text",
          )}
        >
          <CloseIcon size={11} aria-hidden />
        </button>
      </span>
    );
  },
);
Chip.displayName = "Chip";
