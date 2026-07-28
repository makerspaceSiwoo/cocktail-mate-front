"use client";

import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { type LikedCocktail, likeQueries } from "@/entities/like";
import { Card } from "@/shared/ui/card";

import { LikeListEmptyState, LikeListErrorState, LikeListLoadingState } from "./like-list-states";
import { LikedCocktailRow } from "./liked-cocktail-row";

const LIKES_PER_PAGE = 10;

export function LikedCocktailInfiniteList() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isRequestingNextPageRef = useRef(false);
  const likedCocktails = useInfiniteQuery(likeQueries.infinite(LIKES_PER_PAGE));
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } = likedCocktails;
  const cocktails = useMemo(
    () => deduplicateCocktails(likedCocktails.data?.pages.flatMap((page) => page.cocktails) ?? []),
    [likedCocktails.data],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasNextPage || isFetchingNextPage || isFetchNextPageError) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || isRequestingNextPageRef.current) return;

        isRequestingNextPageRef.current = true;
        observer.disconnect();
        void fetchNextPage().finally(() => {
          isRequestingNextPageRef.current = false;
        });
      },
      { rootMargin: "160px 0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError]);

  if (likedCocktails.isPending) {
    return (
      <Card className="border-border-soft w-full rounded-[16px] p-4">
        <LikeListLoadingState />
      </Card>
    );
  }

  if (likedCocktails.isError && !likedCocktails.data) {
    return (
      <Card className="border-border-soft w-full rounded-[16px] p-4">
        <LikeListErrorState onRetry={() => void likedCocktails.refetch()} />
      </Card>
    );
  }

  if (cocktails.length === 0) {
    return (
      <Card className="border-border-soft w-full rounded-[16px] p-4">
        <LikeListEmptyState />
      </Card>
    );
  }

  return (
    <Card className="border-border-soft w-full min-w-0 rounded-[16px] p-4">
      <ul>
        {cocktails.map((cocktail, index) => (
          <LikedCocktailRow
            key={cocktail.cocktailId}
            cocktail={cocktail}
            showDivider={index < cocktails.length - 1}
          />
        ))}
      </ul>

      {likedCocktails.isFetchingNextPage ? (
        <LikeListLoadingState message="좋아요 목록을 더 불러오는 중..." />
      ) : null}

      {likedCocktails.isFetchNextPageError ? (
        <LikeListErrorState
          message="다음 좋아요 목록을 불러오지 못했습니다."
          onRetry={() => void likedCocktails.fetchNextPage()}
        />
      ) : null}

      <div ref={sentinelRef} className="h-px w-full" aria-hidden />
    </Card>
  );
}

function deduplicateCocktails(cocktails: LikedCocktail[]): LikedCocktail[] {
  const uniqueCocktails = new Map<number, LikedCocktail>();

  for (const cocktail of cocktails) {
    if (!uniqueCocktails.has(cocktail.cocktailId)) {
      uniqueCocktails.set(cocktail.cocktailId, cocktail);
    }
  }

  return [...uniqueCocktails.values()];
}
