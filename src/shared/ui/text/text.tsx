import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib";

const textVariants = cva("text-text", {
  variants: {
    variant: {
      // Display / heading scale — tuned to the Figma type ramp.
      display: "font-serif font-bold text-[26px] tracking-[-0.02em]",
      title: "font-bold text-[17px] tracking-[-0.02em]",
      subtitle: "font-bold text-[16px] tracking-[-0.02em]",
      body: "text-[14px]",
      caption: "text-[12px]",
      micro: "text-[11px] leading-none",
    },
    tone: {
      default: "text-text",
      muted: "text-muted",
      heart: "text-heart",
      accent: "text-accent",
      // Inverse for use on dark surfaces (e.g. text-bg on bg-text).
      inverse: "text-bg",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    truncate: {
      true: "block truncate",
      false: "",
    },
  },
  defaultVariants: {
    variant: "body",
    tone: "default",
    truncate: false,
  },
});

export type TextVariants = VariantProps<typeof textVariants>;

type TextElement =
  | "p"
  | "span"
  | "div"
  | "label"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    TextVariants {
  /** HTML tag to render. Default `<span>`. */
  as?: TextElement;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as = "span",
      variant,
      tone,
      weight,
      align,
      truncate,
      className,
      ...props
    },
    ref,
  ) => {
    return React.createElement(as, {
      ref,
      className: cn(
        textVariants({ variant, tone, weight, align, truncate }),
        className,
      ),
      ...props,
    });
  },
);
Text.displayName = "Text";

export { textVariants };
