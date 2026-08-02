"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { cocktailQueries } from "@/entities/cocktail";
import { getCocktailThumbnailUrl } from "@/shared/lib/cocktail-image.mjs";
import { Avatar } from "@/shared/ui/avatar";
import { HeartFilledIcon } from "@/shared/ui/icon/icons";

/** 랭킹 디스크 배경색 — 추천 컴포넌트와 동일 팔레트를 순환한다. */
const RANKING_COLORS = [
  "var(--color-recommend-sage)",
  "var(--color-recommend-rose)",
  "var(--color-recommend-mango)",
  "var(--color-recommend-cream)",
] as const;

/** 좋아요 수를 1.2K 형태로 축약한다. 1000 미만은 그대로. */
function formatLikeCount(count: number): string {
  if (count < 1000) return String(count);
  const thousands = count / 1000;
  return `${thousands.toFixed(1).replace(/\.0$/, "")}K`;
}

/**
 * 홈: 전체 좋아요 수 기준 상위 10개 칵테일(GET /ranking)을 가로 스크롤로 노출한다.
 * 공개 엔드포인트라 로그인 여부와 무관하게 호출한다. 데이터가 없거나 실패하면
 * (엔드포인트 미배포 포함) 섹션 자체를 렌더하지 않아 홈이 깨지지 않는다.
 */
export function LikesRanking() {
  const ranking = useQuery(cocktailQueries.ranking(10));

  if (!ranking.data?.length) return null;

  return (
    <section aria-labelledby="likes-ranking-title" className="flex flex-col gap-3">
      <h2 id="likes-ranking-title" className="text-lg font-bold">
        좋아요 랭킹
      </h2>

      {/* 가로 overflow 시 스크롤 (스크롤바 숨김). */}
      <ol className="flex [scrollbar-width:none] gap-1 overflow-x-auto overscroll-x-contain pb-1 [&::-webkit-scrollbar]:hidden">
        {ranking.data.map((cocktail, index) => (
          <li key={cocktail.id} className="shrink-0">
            <Link
              href={`/detail/${cocktail.id}`}
              aria-label={`${index + 1}위 ${cocktail.name} 상세 보기`}
              className="focus-visible:outline-accent flex w-20 flex-col items-center gap-2 rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="relative">
                <Avatar
                  size="md"
                  src={cocktail.imageUrl ? getCocktailThumbnailUrl(cocktail.imageUrl) : undefined}
                  alt={cocktail.name}
                  fallbackColor={RANKING_COLORS[index % RANKING_COLORS.length]}
                />
                <span
                  aria-hidden
                  className="bg-text text-bg absolute -top-1 -left-1 flex size-6 items-center justify-center rounded-full text-[13px] font-bold"
                >
                  {index + 1}
                </span>
              </span>
              <span className="text-text line-clamp-2 min-h-[2.75em] w-full text-center text-xs leading-snug break-keep">
                {cocktail.name}
              </span>
              <span className="text-muted flex items-center gap-1 text-xs">
                <HeartFilledIcon size={13} className="text-heart" aria-hidden />
                {formatLikeCount(cocktail.likeCount)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
