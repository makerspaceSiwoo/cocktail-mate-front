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

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="하단 네비게이션"
      className={cn(
        // 공통: 화면 하단 고정, 최대 430px 중앙 정렬, 흰색 배경
        "sticky bottom-0 mx-auto mt-auto w-full max-w-[430px] bg-white",
        // 모바일(<=430px): 화면 폭에 꽉 차며 위쪽 경계선만
        "border-t border-border",
        // PC(>430px): pill 형태 — bottom 에서 띄우고, 전체 테두리 + 그림자, 둥근 모서리
        "min-[431px]:mb-4 min-[431px]:rounded-full min-[431px]:border min-[431px]:shadow-lg",
      )}
    >
      <ul className="flex h-15 w-full items-stretch justify-around px-2">
        {ITEMS.map(({ href, label, Icon, IconFilled }) => {
          const active = pathname === href;
          const TabIcon = active ? IconFilled : Icon;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-xs",
                  active ? "font-bold text-text" : "font-normal text-muted",
                )}
              >
                <TabIcon size={24} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
