"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { likeQueries } from "@/entities/like";
import { useAuth } from "@/features/auth";
import { LikeButton } from "@/features/like";
import { Button } from "@/shared/ui/button";
import { ShareIcon } from "@/shared/ui/icon/icons";

import { shareCurrentPage } from "./share-current-page";

export function DetailActions({ cocktailId, title }: { cocktailId: number; title: string }) {
  const [shared, setShared] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();
  const likedCocktails = useQuery({
    ...likeQueries.list(),
    enabled: Boolean(user),
  });
  const likedCocktail = likedCocktails.data?.cocktails.find(
    (cocktail) => cocktail.cocktailId === cocktailId,
  );

  async function share() {
    try {
      const copied = await shareCurrentPage(title);
      if (copied) setShared(true);
    } catch {
      // 사용자가 공유 창을 닫은 경우 현재 화면을 유지한다.
    }
  }

  return (
    <div id="detail-actions" className="grid scroll-mt-[70px] grid-cols-2 gap-2 px-[22px] pt-5">
      <LikeButton
        cocktailId={cocktailId}
        initialLiked={Boolean(likedCocktail?.isLiked)}
        initialLikeCount={likedCocktail?.likeCount}
        disabled={isAuthLoading || (Boolean(user) && likedCocktails.isPending)}
        variant="action"
      />
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={share}
        className="border-border-soft h-[50px] rounded-[14px]"
      >
        <ShareIcon size={18} aria-hidden />
        {shared ? "링크 복사됨" : "공유"}
      </Button>
    </div>
  );
}
