"use client";

import * as React from "react";

import { cn } from "@/shared/lib";
import { CloseIcon } from "@/shared/ui/icon/icons";

type ButtonBase = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children">;

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
    { label, active = false, onRemove, removeLabel = "삭제", className, disabled, ...rest },
    ref,
  ) => {
    const colorClass = active
      ? "bg-text text-bg"
      : "bg-card-bg text-text border border-border hover:bg-chip-bg";

    if (!onRemove) {
      return (
        <button
          ref={ref}
          type="button"
          aria-pressed={active}
          disabled={disabled}
          className={cn(
            "focus-visible:ring-accent focus-visible:ring-offset-bg inline-flex cursor-pointer items-center rounded-full px-4 py-2 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            colorClass,
            className,
          )}
          {...rest}
        >
          {label}
        </button>
      );
    }

    return (
      <span
        className={cn(
          "focus-within:ring-accent focus-within:ring-offset-bg inline-flex cursor-pointer items-center rounded-full text-[13px] font-medium transition-colors focus-within:ring-2 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          colorClass,
          className,
        )}
      >
        <button
          ref={ref}
          type="button"
          aria-pressed={active}
          disabled={disabled}
          className="inline-flex cursor-pointer items-center rounded-l-full py-1.5 pr-2 pl-3.5 focus-visible:outline-none disabled:cursor-not-allowed"
          {...rest}
        >
          {label}
        </button>
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
            "mr-1 inline-flex size-6 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none disabled:cursor-not-allowed",
            active ? "text-bg hover:bg-white/15" : "text-muted hover:bg-chip-bg hover:text-text",
          )}
        >
          <CloseIcon size={11} aria-hidden />
        </button>
      </span>
    );
  },
);
Chip.displayName = "Chip";
