"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cn } from "@/shared/lib";

type SizeToken = "sm" | "md" | "lg";

const SIZE_CLASS: Record<SizeToken, string> = {
  sm: "size-12",
  md: "size-16",
  lg: "size-[88px]",
};

// Default cap on caption width so long names wrap to ~2 lines instead of
// stretching to the parent container width. Tuned per size.
const CAPTION_MAX_WIDTH: Record<SizeToken, string> = {
  sm: "max-w-[6rem]",
  md: "max-w-[7rem]",
  lg: "max-w-[8rem]",
};

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  /** Image url. When missing or failing to load, the fallback renders. */
  src?: string;
  /** Required alt text — used by both the <img> and the fallback's aria-label. */
  alt: string;
  /**
   * Predefined size token (sm 48 / md 64 / lg 88) — or pass a `style.size` /
   * className for a custom diameter. Default `md`.
   */
  size?: SizeToken;
  /**
   * Solid fallback background color (CSS value, e.g. `"#e2eed8"`). Used when
   * `src` is missing or the image fails to load. Defaults to the chip-bg token.
   */
  fallbackColor?: string;
  /** Optional fallback children (initials, icon). Falls back to a blank tile. */
  fallback?: React.ReactNode;
  /** Milliseconds to wait before showing the fallback while the image loads. */
  delayMs?: number;
  /**
   * Optional text shown centered below the circle. Wraps naturally on
   * whitespace (and keeps Korean phrases together via `break-keep`).
   */
  caption?: React.ReactNode;
}

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(
  (
    {
      src,
      alt,
      size = "md",
      fallbackColor,
      fallback,
      delayMs,
      caption,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const circle = (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0 overflow-hidden rounded-full",
          SIZE_CLASS[size],
          className,
        )}
        style={style}
        {...rest}
      >
        {src ? (
          <AvatarPrimitive.Image
            src={src}
            alt={alt}
            className="block size-full object-cover"
          />
        ) : null}
        <AvatarPrimitive.Fallback
          delayMs={delayMs}
          aria-label={alt}
          className="flex size-full items-center justify-center text-text"
          style={{ backgroundColor: fallbackColor ?? "var(--color-chip-bg)" }}
        >
          {fallback}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );

    if (!caption) return circle;

    return (
      <span className="inline-flex flex-col items-center gap-2">
        {circle}
        <span
          className={cn(
            "text-xs text-text text-center break-keep leading-snug",
            CAPTION_MAX_WIDTH[size],
          )}
        >
          {caption}
        </span>
      </span>
    );
  },
);
Avatar.displayName = "Avatar";
