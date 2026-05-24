"use client";

import * as React from "react";

import { cn } from "@/shared/lib";

export type SocialBrand = "kakao" | "apple" | "google";

export interface SocialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  brand: SocialBrand;
  label?: string;
}

const BRAND_STYLES: Record<SocialBrand, string> = {
  kakao: "bg-[#fee500] border-[#fee500] text-[#1d1814]",
  apple: "bg-[#1d1814] border-[#1d1814] text-white",
  google: "bg-white border-border text-text",
};

const BRAND_LABELS: Record<SocialBrand, string> = {
  kakao: "카카오로 계속하기",
  apple: "Apple로 계속하기",
  google: "Google로 계속하기",
};

function KakaoLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 1.5C4.6 1.5 1 4.2 1 7.5c0 2.1 1.5 4 3.8 5.1l-.7 2.6c-.1.3.3.5.6.3l3-2c.4 0 .9.1 1.3.1 4.4 0 8-2.7 8-6S13.4 1.5 9 1.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M13.6 9.5c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.6.8-3.2.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.7.8-3.5 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.1 1.1-2.2 1.2-2.2 0 0-2.5-.9-2.5-3.8zM11.6 3.3c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 4.5c1.3 0 2.4.5 3.3 1.4l2.4-2.4C13.2 2 11.2 1 9 1 5.5 1 2.5 3 1.2 6l2.8 2.2C4.6 6 6.6 4.5 9 4.5zM17 9c0-.6-.1-1.2-.2-1.8H9v3.6h4.5c-.2 1-.8 1.8-1.7 2.4l2.7 2.1C16 13.9 17 11.6 17 9zM4 10.8c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8L1.2 5C.4 6.2 0 7.6 0 9s.4 2.8 1.2 4l2.8-2.2zM9 17c2.4 0 4.4-.8 5.9-2.2l-2.7-2.1c-.8.5-1.8.8-3.2.8-2.4 0-4.4-1.5-5.2-3.7L1 11.9C2.3 14.9 5.4 17 9 17z"
        fill="currentColor"
      />
    </svg>
  );
}

function BrandLogo({ brand }: { brand: SocialBrand }) {
  if (brand === "kakao") return <KakaoLogo />;
  if (brand === "apple") return <AppleLogo />;
  return <GoogleLogo />;
}

export const SocialButton = React.forwardRef<
  HTMLButtonElement,
  SocialButtonProps
>(({ brand, label, className, type, children, ...rest }, ref) => {
  const text = label ?? BRAND_LABELS[brand];
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={cn(
        "flex items-center justify-center gap-2.5 h-12 w-full px-4 py-3.5 rounded-2xl border font-semibold text-[14px] transition-opacity cursor-pointer hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        BRAND_STYLES[brand],
        className,
      )}
      {...rest}
    >
      <BrandLogo brand={brand} />
      <span>{children ?? text}</span>
    </button>
  );
});
SocialButton.displayName = "SocialButton";
