"use client";

import * as React from "react";

import { cn } from "@/shared/lib";

export interface SoloLegendItem {
  id: string;
  label: string;
  color: string;
}

export interface SoloLegendProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: readonly SoloLegendItem[];
  selectedId: string | null;
  onChange: (selectedId: string | null) => void;
  size?: "md" | "sm" | "xs";
}

const SIZE_CLASS = {
  md: {
    wrapper: "gap-2.5",
    button: "min-h-10 px-4",
    dot: "size-3.5",
    text: "text-[13px] leading-5 font-semibold",
  },
  sm: {
    wrapper: "gap-2",
    button: "min-h-9 px-3.5",
    dot: "size-3",
    text: "text-xs leading-[18px] font-semibold",
  },
  xs: {
    wrapper: "gap-x-1.5 gap-y-1",
    button: "min-h-7 px-3",
    dot: "size-2.5",
    text: "text-[11px] leading-4 font-semibold",
  },
} as const;

export const SoloLegend = React.forwardRef<HTMLDivElement, SoloLegendProps>(
  ({ items, selectedId, onChange, size = "md", className, ...rest }, ref) => {
    const soloMode = selectedId !== null;
    const sizeClass = SIZE_CLASS[size];

    return (
      <div ref={ref} className={cn("flex flex-wrap", sizeClass.wrapper, className)} {...rest}>
        {items.map((item) => {
          const selected = selectedId === item.id;
          const dimmed = soloMode && !selected;

          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? null : item.id)}
              className={cn(
                "bg-card-bg text-text border-border inline-flex cursor-pointer items-center gap-2 rounded-full border transition-all",
                "focus-visible:ring-accent focus-visible:ring-offset-bg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                sizeClass.button,
                sizeClass.text,
                selected && "border-accent shadow-[0_4px_14px_rgba(184,138,92,0.18)]",
                dimmed && "opacity-35",
              )}
            >
              <span
                aria-hidden
                className={cn("shrink-0 rounded-full", sizeClass.dot)}
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  },
);
SoloLegend.displayName = "SoloLegend";
