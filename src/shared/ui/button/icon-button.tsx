"use client";

import * as React from "react";

import { cn } from "@/shared/lib";

import { Button, type ButtonProps } from "./button";

export interface IconButtonProps
  extends Omit<ButtonProps, "children" | "size" | "fullWidth"> {
  icon: React.ReactNode;
  "aria-label": string;
  size?: "sm" | "md" | "lg";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = "md", ...rest }, ref) => {
    const sizeClass =
      size === "sm"
        ? "h-9 w-9 p-0"
        : size === "lg"
          ? "h-12 w-12 p-0"
          : "h-11 w-11 p-0";
    return (
      <Button ref={ref} className={cn(sizeClass, className)} {...rest}>
        {icon}
      </Button>
    );
  },
);
IconButton.displayName = "IconButton";
