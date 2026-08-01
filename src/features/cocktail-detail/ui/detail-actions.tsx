"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { cocktailQueries } from "@/entities/cocktail";
import { useAuth } from "@/features/auth";
import { LikeButton } from "@/features/like";
import { Button } from "@/shared/ui/button";
import { ShareIcon } from "@/shared/ui/icon/icons";

import { shareCurrentPage } from "./share-current-page";

interface DetailActionsProps {
  cocktailId: number;
  title: string;
  initialLiked: boolean;
  initialLikeCount: number;
}

export function DetailActions({
  cocktailId,
  title,
  initialLiked,
  initialLikeCount,
}: DetailActionsProps) {
  const [shared, setShared] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();
  // SSR 은 익명(isLiked=false)으로 렌더된다. 로그인 사용자만 상세를 authed 로 재요청해
  // 좋아요/카운트를 보정하고, 비로그인은 추가 요청 없이 SSR 데이터를 그대로 쓴다.
  const { data: authenticatedCocktail } = useQuery({
    ...cocktailQueries.detail(cocktailId),
    enabled: !isAuthLoading && user !== null,
    refetchOnMount: "always",
  });
  const isLiked = authenticatedCocktail?.isLiked ?? initialLiked;
  const likeCount = authenticatedCocktail?.likeCount ?? initialLikeCount;

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
        key={`${cocktailId}-${isLiked}-${likeCount}`}
        cocktailId={cocktailId}
        initialLiked={isLiked}
        initialLikeCount={likeCount}
        disabled={isAuthLoading}
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
