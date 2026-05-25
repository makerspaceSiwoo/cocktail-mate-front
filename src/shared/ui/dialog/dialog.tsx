"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import {
  DialogProvider as AsyncDialogProvider,
  useDialog as useAsyncDialog,
  type AsyncDialogComponent,
  type AsyncDialogProps,
} from "react-dialog-async";

import { cn } from "@/shared/lib";

type Position = "center" | "bottom";

export interface DialogProps {
  /** Open/close state. When using react-dialog-async, this comes from `isOpen`. */
  open: boolean;
  /** Close handler. When using react-dialog-async, pass `handleClose`. */
  onClose: () => void;
  /**
   * Where the dialog appears.
   * - "center": modal centered on the screen
   * - "bottom": sheet rising from the bottom of the viewport
   */
  position?: Position;
  /** Accessible title — REQUIRED by Radix. Use `srOnlyTitle` to visually hide. */
  title: string;
  /** Optional accessible description (always rendered to the a11y tree). */
  description?: string;
  /** Visually hide the title (still announced to screen readers). Default false. */
  srOnlyTitle?: boolean;
  /** Hide the bottom-sheet drag handle (ignored when position="center"). */
  hideHandle?: boolean;
  /** When false, prevents closing via overlay click / ESC. Default true. */
  dismissible?: boolean;
  /** Body content. */
  children?: React.ReactNode;
  /** Extra className appended to the content panel. */
  className?: string;
}

// Tailwind v4 fails to parse arbitrary values with a comma inside (e.g.
// `w-[min(90vw,420px)]`) — splits at the comma and emits nothing. Use
// `max-w-[90vw]` + `w-[420px]` instead.
//
// Centering uses Tailwind's `-translate-x-1/2` (which composes into the
// `transform` CSS property). The bottom sheet's open keyframe animates
// the *separate* `translate` CSS property so centering survives the
// animation untouched.
const POSITION_CLASS: Record<Position, string> = {
  center:
    "fixed left-1/2 top-1/2 z-50 w-[420px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card-bg border border-border-soft p-6 shadow-2xl data-[state=open]:animate-[dialog-center-in_200ms_ease-out]",
  bottom:
    "fixed bottom-0 left-1/2 z-50 w-[375px] -translate-x-1/2 rounded-t-3xl border border-border-soft border-b-0 bg-card-bg pt-3.5 px-5.5 pb-4.5 flex flex-col data-[state=open]:animate-[dialog-bottom-in_200ms_ease-out]",
};

export function Dialog({
  open,
  onClose,
  position = "center",
  title,
  description,
  srOnlyTitle = false,
  hideHandle = false,
  dismissible = true,
  children,
  className,
}: DialogProps) {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && dismissible) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-40 bg-black/40",
            "data-[state=open]:animate-[overlay-fade-in_200ms_ease-out]",
          )}
        />
        <DialogPrimitive.Content
          aria-describedby={description ? undefined : undefined}
          onEscapeKeyDown={(e) => {
            if (!dismissible) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (!dismissible) e.preventDefault();
          }}
          className={cn(
            POSITION_CLASS[position],
            "focus-visible:outline-none",
            className,
          )}
        >
          {position === "bottom" && !hideHandle ? (
            <div className="flex h-[22px] w-full items-center justify-center pb-3.5">
              <div
                className="h-1 w-9 rounded-full bg-text"
                aria-hidden="true"
              />
            </div>
          ) : null}

          <DialogPrimitive.Title
            className={cn(
              srOnlyTitle
                ? "sr-only"
                : "mb-2 font-bold text-[17px] text-text",
            )}
          >
            {title}
          </DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description
              className={cn("mb-3 text-[13px] text-muted")}
            >
              {description}
            </DialogPrimitive.Description>
          ) : (
            // Radix complains if there's no description; provide an empty
            // sr-only one when none is supplied so the a11y tree is valid.
            <DialogPrimitive.Description className="sr-only">
              {title}
            </DialogPrimitive.Description>
          )}

          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// Re-exports so consumers can wire react-dialog-async without a direct dep.
export const DialogProvider = AsyncDialogProvider;
export const useDialog = useAsyncDialog;
export type { AsyncDialogComponent, AsyncDialogProps };
