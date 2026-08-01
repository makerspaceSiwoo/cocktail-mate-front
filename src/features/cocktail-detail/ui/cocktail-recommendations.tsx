"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { cocktailQueries } from "@/entities/cocktail";
import { useAuth } from "@/features/auth";

const DISC_COLORS = [
  "bg-recommend-sage",
  "bg-recommend-rose",
  "bg-recommend-mango",
  "bg-recommend-cream",
] as const;

interface CocktailRecommendationsProps {
  cocktailId: number;
}

export function CocktailRecommendations({ cocktailId }: CocktailRecommendationsProps) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const recommendations = useQuery({
    ...cocktailQueries.recommendations(cocktailId),
    enabled: !isAuthLoading && user !== null,
  });

  if (isAuthLoading || !user || !recommendations.data?.length) return null;

  return (
    <section aria-labelledby="recommended-cocktails-title" className="px-[22px] pt-5 pb-4">
      <h2
        id="recommended-cocktails-title"
        className="text-text text-[16px] leading-normal font-bold"
      >
        추천 칵테일
      </h2>

      <ul className="mt-[14px] flex w-full items-start justify-between overflow-hidden">
        {recommendations.data.slice(0, 4).map((cocktail, index) => (
          <li key={cocktail.id} className="shrink-0">
            <Link
              href={`/detail/${cocktail.id}`}
              className="focus-visible:outline-accent flex w-[72px] flex-col items-center justify-center gap-2 rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label={`${cocktail.name} 상세 보기`}
            >
              <span aria-hidden className={`${DISC_COLORS[index]} size-16 shrink-0 rounded-full`} />
              <span className="text-text line-clamp-2 min-h-7 w-full text-center text-[11px] leading-[14px] font-medium break-keep">
                {cocktail.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
