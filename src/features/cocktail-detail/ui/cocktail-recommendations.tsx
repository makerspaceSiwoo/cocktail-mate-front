"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { cocktailQueries } from "@/entities/cocktail";
import { getCocktailThumbnailUrl } from "@/shared/lib/cocktail-image.mjs";
import { Avatar } from "@/shared/ui/avatar";

/** 추천 디스크 배경색 — Figma 추천 컴포넌트 팔레트를 순환한다. */
const RECOMMEND_COLORS = [
  "var(--color-recommend-sage)",
  "var(--color-recommend-rose)",
  "var(--color-recommend-mango)",
  "var(--color-recommend-cream)",
] as const;

interface CocktailRecommendationsProps {
  cocktailId: number;
}

export function CocktailRecommendations({ cocktailId }: CocktailRecommendationsProps) {
  // /cocktail/{id}/recommend 는 공개 엔드포인트(인증 불필요)라 모두에게 노출한다.
  const recommendations = useQuery(cocktailQueries.recommendations(cocktailId));

  if (!recommendations.data?.length) return null;

  return (
    <section aria-labelledby="recommended-cocktails-title" className="px-[22px] pt-5 pb-4">
      <h2
        id="recommended-cocktails-title"
        className="text-text text-[16px] leading-normal font-bold"
      >
        추천 칵테일
      </h2>

      {/* 가로 overflow 시 스크롤 (스크롤바 숨김). */}
      <ul className="mt-[14px] flex [scrollbar-width:none] gap-1 overflow-x-auto overscroll-x-contain pb-1 [&::-webkit-scrollbar]:hidden">
        {recommendations.data.slice(0, 5).map((cocktail, index) => (
          <li key={cocktail.id} className="shrink-0">
            <Link
              href={`/detail/${cocktail.id}`}
              aria-label={`${cocktail.name} 상세 보기`}
              className="focus-visible:outline-accent flex rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Avatar
                size="md"
                src={cocktail.imageUrl ? getCocktailThumbnailUrl(cocktail.imageUrl) : undefined}
                alt={cocktail.name}
                fallbackColor={RECOMMEND_COLORS[index % RECOMMEND_COLORS.length]}
                caption={cocktail.name}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
