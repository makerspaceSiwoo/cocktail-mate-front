"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "@/shared/lib";

export const BottomSheetRoot = DialogPrimitive.Root;
export const BottomSheetTrigger = DialogPrimitive.Trigger;
export const BottomSheetClose = DialogPrimitive.Close;
export const BottomSheetPortal = DialogPrimitive.Portal;

export const BottomSheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/40 transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
      className,
    )}
    {...props}
  />
));
BottomSheetOverlay.displayName = "BottomSheetOverlay";

export interface BottomSheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Hide the visible drag handle. Default false. */
  hideHandle?: boolean;
}

export const BottomSheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  BottomSheetContentProps
>(({ className, children, hideHandle = false, ...props }, ref) => (
  <BottomSheetPortal>
    <BottomSheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-[375px] rounded-t-3xl border border-border-soft border-b-0 bg-card-bg pt-3.5 px-5.5 pb-4.5 flex flex-col transition-transform data-[state=closed]:translate-y-full data-[state=open]:translate-y-0 focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      {!hideHandle ? (
        <div className="flex items-center justify-center pb-3.5 h-[22px] w-full">
          <div
            className="h-1 w-9 rounded-full bg-text"
            aria-hidden="true"
          />
        </div>
      ) : null}
      {children}
    </DialogPrimitive.Content>
  </BottomSheetPortal>
));
BottomSheetContent.displayName = "BottomSheetContent";

export const BottomSheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-bold text-[17px] text-text", className)}
    {...props}
  />
));
BottomSheetTitle.displayName = "BottomSheetTitle";

export const BottomSheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-[13px] text-muted", className)}
    {...props}
  />
));
BottomSheetDescription.displayName = "BottomSheetDescription";
