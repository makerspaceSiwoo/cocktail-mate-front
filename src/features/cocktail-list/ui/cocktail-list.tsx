"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import { cocktailQueries, type CocktailSummary } from "@/entities/cocktail";
import { Chip } from "@/shared/ui/chip";
import { HeartFilledIcon, HeartIcon } from "@/shared/ui/icon/icons";

type CocktailBase = "데킬라" | "럼" | "위스키" | "진" | "보드카";

type Cocktail = {
  id: string;
  name: string;
  base: CocktailBase;
  description: string;
  abv: number;
  likes: string;
  liked: boolean;
  imageUrl: string;
};

const CATEGORIES = ["전체", "보드카", "진", "럼", "위스키", "데킬라"] as const;

const BASE_TAGS: Record<Exclude<(typeof CATEGORIES)[number], "전체">, string> = {
  보드카: "vodka",
  진: "gin",
  럼: "rum",
  위스키: "whiskey",
  데킬라: "tequila",
};

const BASE_BADGE_CLASS: Record<CocktailBase, string> = {
  데킬라: "bg-banner-bg",
  럼: "bg-chip-bg",
  위스키: "bg-cream-200",
  진: "bg-profile-bg",
  보드카: "bg-border-soft",
};

const BASE_LABELS: Record<string, CocktailBase> = {
  tequila: "데킬라",
  rum: "럼",
  whiskey: "위스키",
  whisky: "위스키",
  gin: "진",
  vodka: "보드카",
  데킬라: "데킬라",
  럼: "럼",
  위스키: "위스키",
  진: "진",
  보드카: "보드카",
};

function normalizeBase(baseTag: string): CocktailBase | null {
  const normalizedTag = baseTag.trim().toLowerCase();
  const compactTag = normalizedTag.replace(/[\s_-]/g, "");

  return BASE_LABELS[normalizedTag] ?? BASE_LABELS[compactTag] ?? null;
}

function normalizeImageUrl(imageUrl: string | null): string {
  if (!imageUrl) return "";

  const match = imageUrl.match(
    /^https:\/\/fastly\.picsum\.photos\/id\/([^/]+)\/([^/]+)\/([^/.]+)\.jpg$/,
  );

  if (!match) return imageUrl;

  const [, id, width, height] = match;
  return `https://picsum.photos/id/${id}/${width}/${height}`;
}

function toCocktail(summary: CocktailSummary): Cocktail {
  const base = normalizeBase(summary.baseTag) ?? "진";

  return {
    id: String(summary.id),
    name: summary.name,
    base,
    description: summary.description,
    abv: Math.round(summary.abv),
    likes: "-",
    liked: false,
    imageUrl: normalizeImageUrl(summary.imageUrl),
  };
}

export function CocktailList() {
  const scrollContainerRef = useRef<HTMLElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>("전체");
  const selectedBaseTag = selectedCategory === "전체" ? null : BASE_TAGS[selectedCategory];
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery(cocktailQueries.infiniteListByBase(selectedBaseTag));
  const summaries = data?.pages.flatMap((page) => page.items) ?? [];
  const cocktails = summaries.map(toCocktail);

  useEffect(() => {
    const root = scrollContainerRef.current;
    const target = loadMoreRef.current;
    if (!root || !target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) void fetchNextPage();
      },
      { root, rootMargin: "160px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <main className="bg-bg flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <section className="flex h-[50px] items-start px-[22px] pt-[14px]">
        <div className="flex flex-col gap-1">
          <h1 className="text-text text-[28px] leading-[34px] font-black tracking-normal">
            레시피
          </h1>
          <div className="bg-accent h-0.5 w-[84px]" />
        </div>
      </section>

      <nav
        aria-label="칵테일 베이스 필터"
        className="h-[60px] [scrollbar-width:none] overflow-x-auto overflow-y-hidden overscroll-x-contain [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max items-center gap-1 px-[22px] pt-[14px]">
          {CATEGORIES.map((category) => {
            const active = category === selectedCategory;
            return (
              <li key={category}>
                <Chip
                  label={category}
                  active={active}
                  onClick={() => {
                    setSelectedCategory(category);
                    scrollContainerRef.current?.scrollTo({ top: 0 });
                  }}
                  className="h-8 px-4 py-0 text-[14px] leading-8 font-bold whitespace-nowrap"
                />
              </li>
            );
          })}
        </ul>
      </nav>

      <section
        ref={scrollContainerRef}
        aria-label="칵테일 레시피 목록"
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain pb-[max(25px,env(safe-area-inset-bottom))]"
      >
        {cocktails.length > 0 ? (
          <>
            <ul>
              {cocktails.map((cocktail) => (
                <li key={cocktail.id}>
                  <Link
                    href={`/detail/${cocktail.id}`}
                    className="border-border-soft grid h-28 grid-cols-[64px_1fr_24px] items-center gap-3 border-b px-[22px]"
                  >
                    <div
                      className="bg-chip-bg relative size-16 overflow-hidden rounded-full"
                      aria-hidden={!cocktail.imageUrl}
                    >
                      {cocktail.imageUrl ? (
                        <Image
                          src={cocktail.imageUrl}
                          alt=""
                          fill
                          unoptimized
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <article className="grid min-w-0 gap-1.5">
                      <h2 className="text-text truncate text-[18px] leading-[21px] font-black tracking-normal">
                        {cocktail.name}
                      </h2>

                      <p className="text-muted flex min-w-0 items-center gap-2 text-[12px] leading-[19px]">
                        <span
                          className={`text-text h-[19px] shrink-0 rounded-full px-2 text-[12px] leading-[19px] font-black ${BASE_BADGE_CLASS[cocktail.base]}`}
                        >
                          {cocktail.base}
                        </span>
                        <span aria-hidden className="text-border">
                          |
                        </span>
                        <span className="truncate">{cocktail.description}</span>
                      </p>

                      <dl className="text-muted flex items-center gap-[10px] text-[12px] leading-[13px] whitespace-nowrap">
                        <div>
                          <dt className="sr-only">도수</dt>
                          <dd>도수 {cocktail.abv}%</dd>
                        </div>
                        <span aria-hidden className="bg-border h-2.5 w-px" />
                        <div className="flex items-center gap-1">
                          <HeartIcon size={12} aria-hidden />
                          <dt className="sr-only">좋아요</dt>
                          <dd>{cocktail.likes}</dd>
                        </div>
                      </dl>
                    </article>

                    <span className="text-heart self-end pb-8" aria-hidden>
                      {cocktail.liked ? <HeartFilledIcon size={18} /> : <HeartIcon size={18} />}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div ref={loadMoreRef} className="h-px" aria-hidden />
            {isFetchingNextPage ? (
              <p className="text-muted py-4 text-center text-sm" role="status">
                불러오는 중...
              </p>
            ) : null}
          </>
        ) : isPending ? (
          <p className="text-muted pt-10 text-center text-sm" role="status">
            불러오는 중...
          </p>
        ) : (
          <div className="px-[22px] pt-10">
            <p className="border-border-soft bg-card-bg text-muted rounded border px-4 py-5 text-center text-sm">
              {error ? "칵테일 목록을 불러오지 못했습니다." : "등록된 칵테일이 없습니다."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
