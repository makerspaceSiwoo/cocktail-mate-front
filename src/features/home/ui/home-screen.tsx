import type { ReactNode } from "react";
import Link from "next/link";

import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import {
  BellIcon,
  ChevronRightIcon,
  SearchIcon,
  TabCocktailIcon,
  TabExploreIcon,
  TabHomeFilledIcon,
  TabMyIcon,
} from "@/shared/ui/icon/icons";

const featured = {
  name: "코스모폴리탄",
  description: "상큼한 라임과 크랜베리의 조화, 세련된 분위기를 완성하는 칵테일",
  abv: "도수 20%",
  count: "1/5",
};

const picks = [
  { name: "블루 하와이", tone: "bg-[#d4ebf4]", garnish: "bg-[#4fb8df]" },
  { name: "피나 콜라다", tone: "bg-[#f6efd9]", garnish: "bg-[#e6bf62]" },
  { name: "모히토", tone: "bg-[#e2eed8]", garnish: "bg-[#7ebf72]" },
  { name: "진 토닉", tone: "bg-[#eaf2ec]", garnish: "bg-[#9dbca8]" },
  { name: "패션프루트\n마티니", tone: "bg-[#f3e3c4]", garnish: "bg-[#edae45]" },
  { name: "마티니", tone: "bg-[#ebeede]", garnish: "bg-[#b9bda2]" },
  { name: "트로피컬\n선셋", tone: "bg-[#f5dac8]", garnish: "bg-[#f4865f]" },
  { name: "애플 진\n피즈", tone: "bg-[#e6edd1]", garnish: "bg-[#8fbf4f]" },
];

const tabs = [
  { label: "홈", href: "/", icon: TabHomeFilledIcon, active: true },
  { label: "탐색", href: "#picks", icon: TabExploreIcon, active: false },
  { label: "칵테일", href: "#today", icon: TabCocktailIcon, active: false },
  { label: "마이", href: "/me", icon: TabMyIcon, active: false },
];

export function HomeScreen() {
  return (
    <main className="min-h-svh bg-bg text-text">
      <div className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col bg-bg">
        <header className="flex h-[60px] items-center justify-between px-[22px] pt-3">
          <h1 className="font-serif text-[26px] leading-none font-bold">
            CocktailMate
          </h1>
          <div className="flex items-center gap-4 text-text">
            <Link href="/me" aria-label="알림" className="rounded-full p-1">
              <BellIcon size={24} />
            </Link>
            <Link href="#picks" aria-label="검색" className="rounded-full p-1">
              <SearchIcon size={24} />
            </Link>
          </div>
        </header>

        <div className="flex-1 pb-[85px]">
          <section id="today" aria-labelledby="today-title">
            <SectionHeader title="오늘의 추천" titleId="today-title" />
            <div className="px-4 pt-1">
              <Card className="relative h-[220px] overflow-hidden rounded-[20px] border-0 bg-[linear-gradient(135deg,var(--color-coral-500),#752133)] shadow-[0_16px_36px_rgba(42,34,26,0.18)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.22),transparent_24%),linear-gradient(180deg,transparent_30%,rgba(0,0,0,0.5))]" />
                <div
                  aria-hidden
                  className="absolute right-4 top-8 h-32 w-32 rounded-full border border-white/35 bg-white/15"
                >
                  <div className="absolute left-9 top-8 h-16 w-16 rounded-full bg-white/20" />
                  <div className="absolute left-14 top-5 h-24 w-5 rotate-12 rounded-full bg-white/25" />
                </div>
                <div className="relative flex h-full flex-col justify-end px-[22px] py-[22px] text-white">
                  <h2 className="font-serif text-2xl leading-tight font-bold">
                    {featured.name}
                  </h2>
                  <p className="mt-2 max-w-[285px] text-xs leading-[18px] text-white/92">
                    {featured.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <Badge className="bg-black/30 px-3 py-1 text-[11.5px] text-white backdrop-blur">
                      {featured.abv}
                    </Badge>
                    <Badge className="bg-black/30 px-3 py-1 text-[11.5px] text-white backdrop-blur">
                      {featured.count}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex h-[30px] items-start justify-center gap-1.5 pt-3">
              <span className="h-1.5 w-[18px] rounded-full bg-accent" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
            </div>
          </section>

          <section id="picks" aria-labelledby="picks-title">
            <SectionHeader
              title="나를 위한 Pick"
              titleId="picks-title"
              action={
                <Link
                  href="#picks"
                  className="flex items-center gap-0.5 text-xs text-muted"
                >
                  더보기
                  <ChevronRightIcon size={12} />
                </Link>
              }
            />

            <div className="grid grid-cols-4 gap-x-[17px] gap-y-5 px-[18px] pt-2">
              {picks.map((item) => (
                <CocktailDisc
                  key={item.name}
                  name={item.name}
                  tone={item.tone}
                  garnish={item.garnish}
                />
              ))}
            </div>
          </section>
        </div>

        <nav
          aria-label="주요 메뉴"
          className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[430px] border-t border-border bg-white"
        >
          <div className="grid h-[63px] grid-cols-4 pt-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={[
                    "flex flex-col items-center gap-1 px-2 py-1 text-[11px] font-medium",
                    tab.active ? "text-text" : "text-muted",
                  ].join(" ")}
                  aria-current={tab.active ? "page" : undefined}
                >
                  <Icon size={24} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex h-[22px] items-start justify-center bg-white pt-2">
            <span className="h-1 w-[134px] rounded-full bg-text" />
          </div>
        </nav>
      </div>
    </main>
  );
}

function SectionHeader({
  title,
  titleId,
  action,
}: {
  title: string;
  titleId: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex h-9 items-center justify-between px-[22px] py-1.5">
      <h2 id={titleId} className="text-base leading-none font-bold">
        {title}
      </h2>
      {action}
    </div>
  );
}

function CocktailDisc({
  name,
  tone,
  garnish,
}: {
  name: string;
  tone: string;
  garnish: string;
}) {
  return (
    <article className="flex w-[72px] flex-col items-center gap-2 text-center">
      <div className={`relative h-16 w-16 rounded-full ${tone}`}>
        <div className="absolute inset-[11px] rounded-full border border-white/70 bg-white/20" />
        <div
          className={`absolute right-3 top-3 h-3 w-3 rounded-full ${garnish}`}
        />
        <div className="absolute bottom-2 left-1/2 h-5 w-2 -translate-x-1/2 rounded-full bg-white/55" />
      </div>
      <h3 className="whitespace-pre-line text-[11px] leading-[13px] font-medium">
        {name}
      </h3>
    </article>
  );
}
