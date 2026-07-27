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

export interface DialogProps {
  /** Open/close state. When using react-dialog-async, this comes from `isOpen`. */
  open: boolean;
  /** Close handler. When using react-dialog-async, pass `handleClose`. */
  onClose: () => void;
  /** Accessible title — REQUIRED by Radix. Use `srOnlyTitle` to visually hide. */
  title: string;
  /** Optional accessible description (always rendered to the a11y tree). */
  description?: string;
  /** Visually hide the title (still announced to screen readers). Default false. */
  srOnlyTitle?: boolean;
  /** When false, prevents closing via overlay click / ESC. Default true. */
  dismissible?: boolean;
  /** Body content. */
  children?: React.ReactNode;
  /** Extra className appended to the visible panel (NOT the positioning wrapper). */
  className?: string;
}

// Outer wrapper handles positioning + centering. The visible panel is a nested
// element so its open animation (`transform: scale...`) doesn't fight with the
// wrapper's centering transform.
const WRAPPER_CLASS = "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2";
const PANEL_CLASS =
  "w-[420px] max-w-[90vw] rounded-2xl bg-card-bg border border-border-soft p-6 shadow-2xl animate-[dialog-center-in_200ms_ease-out]";

/**
 * 화면 중앙 모달 다이얼로그.
 * 하단 바텀시트는 별도 컴포넌트(`@/shared/ui/bottom-sheet` 의 `BottomSheet`)를 사용한다.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  srOnlyTitle = false,
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
            "animate-[overlay-fade-in_200ms_ease-out]",
          )}
        />
        {/* Wrapper owns positioning + centering. role="dialog" lives here. */}
        <DialogPrimitive.Content
          onEscapeKeyDown={(e) => {
            if (!dismissible) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (!dismissible) e.preventDefault();
          }}
          className={cn(WRAPPER_CLASS, "focus-visible:outline-none")}
        >
          {/* Inner panel is the only element with the entrance animation,
              so the keyframe's transform owns nothing else. */}
          <div className={cn(PANEL_CLASS, className)}>
            <DialogPrimitive.Title
              className={cn(
                srOnlyTitle ? "sr-only" : "mb-2 font-bold text-[17px] text-text",
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
              <DialogPrimitive.Description className="sr-only">
                {title}
              </DialogPrimitive.Description>
            )}

            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// Re-exports so consumers can wire react-dialog-async without a direct dep.
export const DialogProvider = AsyncDialogProvider;
export const useDialog = useAsyncDialog;
export type { AsyncDialogComponent, AsyncDialogProps };
