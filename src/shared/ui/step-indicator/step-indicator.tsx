"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/shared/lib";

export interface StepIndicatorProps {
  /** 1-based current step. Clamped to [0, total]. */
  current: number;
  /** Total number of steps. Default 3. */
  total?: number;
  className?: string;
}

/**
 * Read-only progress bar driven by Radix Slider. `current / total` fills the
 * range proportionally — at current=2 / total=3 the accent fill covers two
 * thirds of the track. No thumb is rendered (display-only).
 */
export function StepIndicator({ current, total = 3, className }: StepIndicatorProps) {
  const value = Math.min(Math.max(current, 0), total);
  return (
    <SliderPrimitive.Root
      value={[value]}
      min={0}
      max={total}
      step={1}
      disabled
      aria-label={`단계 ${value}/${total}`}
      className={cn("relative flex h-[3px] w-full touch-none items-center select-none", className)}
    >
      <SliderPrimitive.Track className="bg-border relative h-[3px] w-full grow overflow-hidden rounded-full">
        <SliderPrimitive.Range className="bg-accent absolute h-full rounded-full transition-[width] duration-300 ease-out" />
      </SliderPrimitive.Track>
      {/* Visually-hidden thumb keeps Radix happy without showing a handle. */}
      <SliderPrimitive.Thumb aria-hidden className="block size-0 outline-none" tabIndex={-1} />
    </SliderPrimitive.Root>
  );
}
