"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { cocktailQueries } from "@/entities/cocktail";
import { useGoBack } from "@/shared/hooks";
import { ChevronLeftIcon } from "@/shared/ui/icon/icons";
import { SearchBar } from "@/shared/ui/search-bar";

import { toCocktailView } from "../lib/cocktail-view";
import { useSearchNav } from "../lib/use-search-nav";
import { CocktailResultRow } from "./cocktail-result-row";

export function SearchResults({ keyword }: { keyword: string }) {
  const [value, setValue] = useState(keyword);
  const { goToResults } = useSearchNav();
  const goBack = useGoBack("/search");
  const scrollContainerRef = useRef<HTMLElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery(cocktailQueries.infiniteSearch(keyword));

  const summaries = data?.pages.flatMap((page) => page.items) ?? [];
  const cocktails = summaries.map(toCocktailView);

  const total = data?.pages[0]?.meta.totalCount ?? cocktails.length;

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
    <main className="bg-bg flex h-dvh w-full flex-col overflow-hidden">
      <div className="bg-bg flex items-center gap-1 px-[14px] py-3">
        <button
          type="button"
          onClick={goBack}
          aria-label="뒤로 가기"
          className="text-text flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full"
        >
          <ChevronLeftIcon size={25} aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <SearchBar
            placeholder="칵테일 이름·재료로 검색"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onSubmit={goToResults}
          />
        </div>
      </div>

      {cocktails.length > 0 ? (
        <p className="text-muted px-[22px] py-3 text-[13px]" role="status">
          <span className="text-text font-bold">{`'${keyword}'`}</span> 검색 결과 {total}건
        </p>
      ) : null}

      <section
        ref={scrollContainerRef}
        aria-label={`'${keyword}' 검색 결과 목록`}
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain pb-[max(25px,env(safe-area-inset-bottom))]"
      >
        {cocktails.length > 0 ? (
          <>
            <ul>
              {cocktails.map((cocktail) => (
                <CocktailResultRow key={cocktail.id} cocktail={cocktail} />
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
            <p className="border-border-soft bg-card-bg text-muted rounded border px-4 py-8 text-center text-sm">
              {error ? (
                "검색 결과를 불러오지 못했습니다."
              ) : (
                <>
                  <span className="text-text mb-1 block font-semibold">{`'${keyword}' 검색 결과가 없어요`}</span>
                  다른 칵테일 이름이나 재료로 검색해보세요.
                </>
              )}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
