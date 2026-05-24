"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/shared/lib";
import { Icon, type IconName } from "@/shared/ui/icon";

export interface BottomTabItem {
  id: string;
  label: string;
  icon: IconName; // inactive icon
  iconFilled?: IconName; // active icon; falls back to `icon` when omitted
  href?: string; // when set, item renders as <Link>; else <button>
}

export interface BottomTabBarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  items: BottomTabItem[];
  activeId: string;
  onSelect?: (id: string) => void;
}

export function BottomTabBar({
  items,
  activeId,
  onSelect,
  className,
  ...rest
}: BottomTabBarProps) {
  return (
    <nav
      aria-label="기본 내비게이션"
      className={cn(
        "flex justify-around items-center border-t border-border bg-card-bg pt-2.5 pb-1",
        className,
      )}
      {...rest}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        const iconName: IconName = isActive
          ? (item.iconFilled ?? item.icon)
          : item.icon;
        const colorClass = isActive ? "text-text" : "text-muted";
        const fontWeight = isActive ? "font-bold" : "font-medium";

        const content = (
          <span
            className={cn(
              "flex flex-col items-center gap-1 px-2 py-1 min-w-14",
              colorClass,
            )}
          >
            <Icon name={iconName} size={26} aria-hidden />
            <span className={cn("text-[11px] leading-none", fontWeight)}>
              {item.label}
            </span>
          </span>
        );

        const ariaCurrent = isActive ? "page" : undefined;
        const sharedClass =
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-md";

        if (item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={ariaCurrent}
              className={sharedClass}
              onClick={() => onSelect?.(item.id)}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            aria-current={ariaCurrent}
            className={sharedClass}
            onClick={() => onSelect?.(item.id)}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}

// Preset item arrays
export const FOUR_TAB_ITEMS: BottomTabItem[] = [
  { id: "home", label: "홈", icon: "TabHome", iconFilled: "TabHome-filled" },
  {
    id: "explore",
    label: "탐색",
    icon: "TabExplore",
    iconFilled: "TabExplore-filled",
  },
  {
    id: "cocktail",
    label: "칵테일",
    icon: "TabCocktail",
    iconFilled: "TabCocktail-filled",
  },
  { id: "my", label: "마이", icon: "TabMy", iconFilled: "TabMy-filled" },
];

export const FIVE_TAB_ITEMS: BottomTabItem[] = [
  { id: "home", label: "홈", icon: "TabHome", iconFilled: "TabHome-filled" },
  {
    id: "explore",
    label: "탐색",
    icon: "TabExplore",
    iconFilled: "TabExplore-filled",
  },
  { id: "search", label: "검색", icon: "Search", iconFilled: "Search-filled" },
  {
    id: "cocktail",
    label: "칵테일",
    icon: "TabCocktail",
    iconFilled: "TabCocktail-filled",
  },
  { id: "my", label: "마이", icon: "TabMy", iconFilled: "TabMy-filled" },
];
