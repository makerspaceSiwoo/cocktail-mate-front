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
      className="sticky bottom-0 mt-auto w-full border-t border-border bg-white"
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
