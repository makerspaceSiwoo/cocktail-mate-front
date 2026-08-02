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

// Fixed caption column width per size — kept just a little wider than the
// circle so the cell stays tight (short rows don't spread out) while long
// names still have room to wrap to 2 lines before the ellipsis. The whole
// captioned cell takes this width regardless of name length, so avatars line
// up with even widths and gaps.
const CAPTION_WIDTH: Record<SizeToken, string> = {
  sm: "w-16",
  md: "w-20",
  lg: "w-28",
};

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
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

export const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  (
    { src, alt, size = "md", fallbackColor, fallback, delayMs, caption, className, style, ...rest },
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
          <AvatarPrimitive.Image src={src} alt={alt} className="block size-full object-cover" />
        ) : null}
        <AvatarPrimitive.Fallback
          delayMs={delayMs}
          aria-label={alt}
          className="text-text flex size-full items-center justify-center"
          style={{ backgroundColor: fallbackColor ?? "var(--color-chip-bg)" }}
        >
          {fallback}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );

    if (!caption) return circle;

    return (
      <span className={cn("inline-flex flex-col items-center gap-2", CAPTION_WIDTH[size])}>
        {circle}
        {/* Fixed width + 2-line clamp: short names center on one line, long
            names wrap to 2 and truncate with an ellipsis. min-h reserves both
            lines so every cell is the same height. */}
        <span className="text-text line-clamp-2 min-h-[2.75em] w-full text-center text-xs leading-snug break-keep">
          {caption}
        </span>
      </span>
    );
  },
);
Avatar.displayName = "Avatar";
