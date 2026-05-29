"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib";
import {
  TabCocktailFilledIcon,
  TabCocktailIcon,
  TabExploreFilledIcon,
  TabExploreIcon,
  TabHomeFilledIcon,
  TabHomeIcon,
  TabMyFilledIcon,
  TabMyIcon,
  type IconComponentProps,
} from "@/shared/ui/icon/icons";

export type BottomNavVariant = "default" | "pill";

type NavItem = {
  href: string;
  label: string;
  Icon: React.ComponentType<IconComponentProps>;
  IconFilled: React.ComponentType<IconComponentProps>;
};

const ITEMS: readonly NavItem[] = [
  {
    href: "/home",
    label: "홈",
    Icon: TabHomeIcon,
    IconFilled: TabHomeFilledIcon,
  },
  {
    href: "/explore",
    label: "탐색",
    Icon: TabExploreIcon,
    IconFilled: TabExploreFilledIcon,
  },
  {
    href: "/list",
    label: "칵테일",
    Icon: TabCocktailIcon,
    IconFilled: TabCocktailFilledIcon,
  },
  {
    href: "/my",
    label: "마이",
    Icon: TabMyIcon,
    IconFilled: TabMyFilledIcon,
  },
];

export interface BottomNavProps {
  /**
   * 시각 모드.
   * - 지정하면 명시적 override — 항상 그 모드로 렌더 (Storybook · 디자인
   *   확정용).
   * - 미지정(undefined)이면 부모의 `@container/shell` 컨테이너 폭에 따라
   *   자동 결정: 폭 ≤ 430 → default, 폭 > 430 → pill. PcShell 은 max-w-430
   *   컨테이너라 항상 default, MobileShell 은 viewport 가 곧 컨테이너 폭이라
   *   viewport > 430 일 때 pill.
   */
  variant?: BottomNavVariant;
  /**
   * 명시적으로 active 경로를 지정한다. 미지정 시 usePathname() 사용.
   * Storybook 같이 라우터가 없는 환경에서 controlled 로 쓰기 위한 prop.
   */
  activeHref?: string;
  /**
   * 클릭 핸들러. 지정하면 next/link 대신 button 으로 렌더하여 라우팅 없이
   * active 상태만 토글한다 (Storybook 데모용).
   */
  onSelect?: (href: string) => void;
}

export function BottomNav({ variant, activeHref, onSelect }: BottomNavProps) {
  const pathname = usePathname();
  const currentHref = activeHref ?? pathname;
  const useButton = !!onSelect;
  const auto = variant === undefined;

  return (
    <nav
      aria-label="하단 네비게이션"
      className={cn(
        // 공통: 하단 고정, 최대 430px 중앙 정렬, 흰색 배경
        "sticky bottom-0 mx-auto mt-auto w-full max-w-107.5 bg-white",
        // 강제 default 또는 auto 의 base (= default 시각)
        (variant === "default" || auto) && "border-border border-t",
        // 강제 pill
        variant === "pill" &&
          "border-border mb-4 rounded-full border shadow-lg",
        // auto: container(@shell) 폭 > 430 이면 pill 로 변형
        auto &&
          "@min-[431px]/shell:mb-4 @min-[431px]/shell:rounded-full @min-[431px]/shell:border @min-[431px]/shell:shadow-lg",
      )}
    >
      <ul className="flex h-15 w-full items-stretch justify-around px-2">
        {ITEMS.map(({ href, label, Icon, IconFilled }) => {
          const active = currentHref === href;
          const TabIcon = active ? IconFilled : Icon;
          const itemClassName = cn(
            "flex h-full w-full flex-col items-center justify-center gap-1 text-xs",
            active ? "text-text font-bold" : "text-muted font-normal",
          );
          return (
            <li key={href} className="flex-1">
              {useButton ? (
                <button
                  type="button"
                  onClick={() => onSelect?.(href)}
                  aria-current={active ? "page" : undefined}
                  className={itemClassName}
                >
                  <TabIcon size={24} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ) : (
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={itemClassName}
                >
                  <TabIcon size={24} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
