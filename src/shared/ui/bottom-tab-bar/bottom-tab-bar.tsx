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
  /** Controlled active id. Pair with onSelect. */
  activeId?: string;
  /** Uncontrolled initial active id. Ignored when activeId is set. */
  defaultActiveId?: string;
  onSelect?: (id: string) => void;
  /** Enable horizontal swipe gesture to move between tabs. Default true. */
  enableSwipe?: boolean;
  /** Pixel distance the pointer must travel before a swipe registers. Default 40. */
  swipeThreshold?: number;
}

const SWIPE_THRESHOLD_DEFAULT = 40;

export function BottomTabBar({
  items,
  activeId: activeIdProp,
  defaultActiveId,
  onSelect,
  enableSwipe = true,
  swipeThreshold = SWIPE_THRESHOLD_DEFAULT,
  className,
  ...rest
}: BottomTabBarProps) {
  const isControlled = activeIdProp !== undefined;
  const [internalId, setInternalId] = React.useState<string>(
    defaultActiveId ?? items[0]?.id ?? "",
  );
  const activeId = isControlled ? activeIdProp : internalId;

  const select = React.useCallback(
    (id: string) => {
      if (!isControlled) setInternalId(id);
      onSelect?.(id);
    },
    [isControlled, onSelect],
  );

  const moveBy = React.useCallback(
    (delta: number) => {
      if (items.length === 0) return;
      const idx = items.findIndex((i) => i.id === activeId);
      const base = idx === -1 ? 0 : idx;
      const next = (base + delta + items.length) % items.length;
      select(items[next]!.id);
    },
    [items, activeId, select],
  );

  // Swipe gesture (pointer events cover mouse, touch and pen)
  const pointerStartX = React.useRef<number | null>(null);
  const pointerActive = React.useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (!enableSwipe) return;
    pointerStartX.current = e.clientX;
    pointerActive.current = true;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!enableSwipe || !pointerActive.current || pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    pointerActive.current = false;
    pointerStartX.current = null;
    if (Math.abs(dx) < swipeThreshold) return;
    moveBy(dx < 0 ? 1 : -1);
  };
  const onPointerCancel = () => {
    pointerActive.current = false;
    pointerStartX.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveBy(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveBy(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (items[0]) select(items[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      const last = items[items.length - 1];
      if (last) select(last.id);
    }
  };

  return (
    <nav
      aria-label="기본 내비게이션"
      className={cn(
        "flex justify-around items-center border-t border-border bg-card-bg pt-2.5 pb-1 touch-pan-y select-none",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
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
              "flex flex-col items-center gap-1 px-2 py-1 min-w-14 transition-colors",
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-md active:opacity-70 transition-opacity";

        if (item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={ariaCurrent}
              className={sharedClass}
              onClick={() => select(item.id)}
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
            onClick={() => select(item.id)}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}

// 4-tab preset for the CocktailMate IA.
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
