"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import { type LikeListResponse, likeQueries } from "@/entities/like";
import { Card } from "@/shared/ui/card";
import { HeartFilledIcon } from "@/shared/ui/icon/icons";

import { LikeButton } from "./like-button";

const BASE_LABELS: Record<string, string> = {
  gin: "진",
  rum: "럼",
  tequila: "데킬라",
  vodka: "보드카",
  whiskey: "위스키",
  whisky: "위스키",
};

function getBaseLabel(baseTag: string) {
  return BASE_LABELS[baseTag.trim().toLowerCase()] ?? baseTag;
}

export function LikedCocktailList() {
  const queryClient = useQueryClient();
  const likedCocktails = useQuery(likeQueries.list());

  function removeCocktail(cocktailId: number, isLiked: boolean) {
    if (isLiked) return;

    queryClient.setQueryData<LikeListResponse>(likeQueries.list().queryKey, (current) =>
      current
        ? {
            cocktails: current.cocktails.filter((cocktail) => cocktail.cocktailId !== cocktailId),
          }
        : current,
    );
  }

  return (
    <Card className="border-border-soft rounded-[16px] p-4">
      <div className="flex h-[50px] items-center gap-2 px-1 pt-1 pb-3">
        <span className="text-heart" aria-hidden>
          <HeartFilledIcon size={20} />
        </span>
        <h2 className="text-text text-[15px] font-bold">좋아요 목록</h2>
      </div>

      {likedCocktails.isPending ? (
        <p className="text-muted py-8 text-center text-sm" role="status">
          좋아요 목록을 불러오는 중...
        </p>
      ) : likedCocktails.isError ? (
        <p className="text-muted py-8 text-center text-sm" role="alert">
          좋아요 목록을 불러오지 못했습니다.
        </p>
      ) : likedCocktails.data.cocktails.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-9 text-center">
          <span className="text-border" aria-hidden>
            <HeartFilledIcon size={28} />
          </span>
          <p className="text-text text-sm font-bold">좋아하는 칵테일을 모아보세요</p>
          <p className="text-muted text-xs">목록이나 상세 화면에서 하트를 눌러 추가할 수 있어요.</p>
        </div>
      ) : (
        <ul>
          {likedCocktails.data.cocktails.map((cocktail, index) => (
            <li
              key={cocktail.cocktailId}
              className={`grid h-20 grid-cols-[56px_minmax(0,1fr)_44px] items-center gap-3 px-1 ${
                index < likedCocktails.data.cocktails.length - 1
                  ? "border-border-soft border-b"
                  : ""
              }`}
            >
              <Link
                href={`/detail/${cocktail.cocktailId}`}
                className="focus-visible:ring-accent col-span-2 grid min-w-0 grid-cols-[56px_minmax(0,1fr)] items-center gap-3 rounded outline-none focus-visible:ring-2"
              >
                <div className="bg-chip-bg relative size-14 overflow-hidden rounded-[12px]">
                  {cocktail.imageUrl ? (
                    <Image
                      src={cocktail.imageUrl}
                      alt=""
                      fill
                      unoptimized
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <h3 className="text-text truncate text-[14px] leading-5 font-bold">
                    {cocktail.cocktailName}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="bg-banner-bg text-text rounded-full px-2 py-0.5 text-[10.5px] font-semibold">
                      {getBaseLabel(cocktail.baseTag)}
                    </span>
                    <span className="text-muted text-[11px]">
                      좋아요 {cocktail.likeCount.toLocaleString("ko-KR")}
                    </span>
                  </div>
                </div>
              </Link>
              <LikeButton
                cocktailId={cocktail.cocktailId}
                initialLiked={cocktail.isLiked}
                initialLikeCount={cocktail.likeCount}
                className="-mr-2"
                onChanged={(isLiked) => removeCocktail(cocktail.cocktailId, isLiked)}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
