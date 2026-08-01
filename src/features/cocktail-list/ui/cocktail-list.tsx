"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import {
  baseTagColor,
  baseTagLabel,
  BASE_TAGS,
  BASE_TAG_MAP,
  cocktailQueries,
  normalizeBaseTag,
  readableTextColor,
  type BaseTag,
  type CocktailListResponse,
  type CocktailSummary,
} from "@/entities/cocktail";
import { useAuth } from "@/features/auth";
import { LikeButton } from "@/features/like";
import { Chip } from "@/shared/ui/chip";

type Cocktail = {
  id: string;
  name: string;
  base: BaseTag;
  description: string;
  abv: number | null;
  liked: boolean;
  imageUrl: string;
};

/** 필터 카테고리: "전체" + 9개 베이스 태그(영문 key). */
const CATEGORIES = ["all", ...BASE_TAGS] as const;
type Category = (typeof CATEGORIES)[number];

function categoryLabel(category: Category): string {
  return category === "all" ? "전체" : BASE_TAG_MAP[category].label;
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
  return {
    id: String(summary.id),
    name: summary.name,
    base: normalizeBaseTag(summary.baseTag ?? ""),
    description: summary.description ?? "설명이 준비 중입니다.",
    abv: summary.abv === null ? null : Math.round(summary.abv),
    liked: summary.isLiked,
    imageUrl: normalizeImageUrl(summary.imageUrl),
  };
}

export function CocktailList({
  initialFirstPage,
}: {
  /** 서버에서 프리페치한 전체(base=null) 첫 페이지. 익명이라 isLiked=false. */
  initialFirstPage?: CocktailListResponse;
}) {
  const scrollContainerRef = useRef<HTMLElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const selectedBaseTag = selectedCategory === "all" ? null : selectedCategory;

  const infiniteOptions = cocktailQueries.infiniteListByBase(selectedBaseTag);
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery(
      // 전체 탭에서만 SSR 첫 페이지로 시드한다(하이드레이션 일치). 다른 베이스 탭은 CSR.
      selectedBaseTag === null && initialFirstPage
        ? { ...infiniteOptions, initialData: { pages: [initialFirstPage], pageParams: [1] } }
        : infiniteOptions,
    );
  const summaries = data?.pages.flatMap((page) => page.items) ?? [];
  const cocktails = summaries.map(toCocktail);

  // SSR 첫 페이지는 익명(isLiked=false)이므로, 로그인 사용자는 전체(base=null) 쿼리를
  // authed 로 한 번 재요청해 좋아요 상태를 보정한다. 비로그인은 재요청하지 않는다.
  const queryClient = useQueryClient();
  const { user, isLoading: isAuthLoading } = useAuth();
  const authedRefetchedRef = useRef(false);
  useEffect(() => {
    if (authedRefetchedRef.current || isAuthLoading || !user || !initialFirstPage) return;
    authedRefetchedRef.current = true;
    void queryClient.invalidateQueries({
      queryKey: cocktailQueries.infiniteListByBase(null).queryKey,
    });
  }, [isAuthLoading, user, initialFirstPage, queryClient]);

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
            칵테일
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
                  label={categoryLabel(category)}
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
              {cocktails.map((cocktail) => {
                const baseColor = baseTagColor(cocktail.base);
                return (
                  <li
                    key={cocktail.id}
                    className="border-border-soft grid h-28 grid-cols-[64px_minmax(0,1fr)_44px] items-center gap-3 border-b px-[22px]"
                  >
                    <Link
                      href={`/detail/${cocktail.id}`}
                      className="focus-visible:ring-accent col-span-2 grid min-w-0 grid-cols-[64px_minmax(0,1fr)] items-center gap-3 rounded outline-none focus-visible:ring-2"
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
                            className="h-[19px] shrink-0 rounded-full px-2 text-[12px] leading-[19px] font-black"
                            style={{
                              backgroundColor: baseColor,
                              color: readableTextColor(baseColor),
                            }}
                          >
                            {baseTagLabel(cocktail.base)}
                          </span>
                          <span aria-hidden className="text-border">
                            |
                          </span>
                          <span className="truncate">{cocktail.description}</span>
                        </p>

                        <dl className="text-muted mt-1.5 flex items-center text-[12px] leading-[13px] whitespace-nowrap">
                          <div>
                            <dt className="sr-only">도수</dt>
                            <dd>도수 {cocktail.abv === null ? "-" : `${cocktail.abv}%`}</dd>
                          </div>
                        </dl>
                      </article>
                    </Link>
                    <LikeButton
                      // liked 가 authed 재요청으로 바뀌면 remount 해 내부 상태를 재시드한다.
                      key={`like-${cocktail.liked}`}
                      cocktailId={Number(cocktail.id)}
                      initialLiked={cocktail.liked}
                      className="-mr-2"
                    />
                  </li>
                );
              })}
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
