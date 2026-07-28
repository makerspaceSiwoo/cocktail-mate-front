"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { likeQueries } from "@/entities/like";
import { Card } from "@/shared/ui/card";
import { ChevronRightIcon, HeartFilledIcon } from "@/shared/ui/icon/icons";

import { LikeListEmptyState, LikeListErrorState, LikeListLoadingState } from "./like-list-states";
import { LikedCocktailRow } from "./liked-cocktail-row";

export function LikedCocktailList() {
  const likedCocktails = useQuery(likeQueries.summary());

  return (
    <Card className="border-border-soft w-full min-w-0 rounded-[16px] p-4">
      <div className="mb-2 flex h-8 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-heart shrink-0" aria-hidden>
            <HeartFilledIcon size={20} />
          </span>
          <h2 className="text-text truncate text-[15px] font-bold">좋아요 목록</h2>
        </div>
        <Link
          href="/my/likes"
          aria-label="좋아요 목록 전체 보기"
          className="text-muted focus-visible:ring-accent flex shrink-0 items-center gap-0.5 rounded px-1 py-1 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-card-bg)]"
        >
          <span>전체 보기</span>
          <ChevronRightIcon size={16} aria-hidden />
        </Link>
      </div>

      {likedCocktails.isPending ? (
        <LikeListLoadingState />
      ) : likedCocktails.isError ? (
        <LikeListErrorState onRetry={() => void likedCocktails.refetch()} />
      ) : likedCocktails.data.cocktails.length === 0 ? (
        <LikeListEmptyState />
      ) : (
        <ul>
          {likedCocktails.data.cocktails.map((cocktail, index) => (
            <LikedCocktailRow
              key={cocktail.cocktailId}
              cocktail={cocktail}
              showDivider={index < likedCocktails.data.cocktails.length - 1}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}
