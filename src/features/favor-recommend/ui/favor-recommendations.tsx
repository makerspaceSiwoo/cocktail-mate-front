"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth";
import { cocktailQueries } from "@/entities/cocktail";
import { Avatar } from "@/shared/ui/avatar";

/** 추천 디스크 배경색 — Figma 추천 컴포넌트 팔레트를 순환한다. */
const RECOMMEND_COLORS = [
  "var(--color-recommend-sage)",
  "var(--color-recommend-rose)",
  "var(--color-recommend-mango)",
  "var(--color-recommend-cream)",
] as const;

/**
 * 홈: 로그인 유저의 좋아요 기반 취향 추천(GET /user/favor)을 가로 스크롤 Avatar 목록으로 노출한다.
 * 인증이 필요한 엔드포인트라 로그인 상태에서만 호출한다(비로그인/로딩 시 렌더 안 함).
 * ※ /user/favor 응답에는 imageUrl 이 없어 Avatar 는 색상 fallback 으로 표시된다.
 */
export function FavorRecommendations() {
  const { user } = useAuth();
  const favor = useQuery({
    ...cocktailQueries.favor(),
    enabled: Boolean(user),
  });

  if (!user || !favor.data?.length) return null;

  return (
    <section aria-labelledby="favor-recommendations-title" className="flex flex-col gap-3">
      <h2 id="favor-recommendations-title" className="text-lg font-bold">
        내 취향 추천
      </h2>

      {/* 가로 overflow 시 스크롤 (스크롤바 숨김). */}
      <ul className="flex [scrollbar-width:none] gap-4 overflow-x-auto overscroll-x-contain pb-1 [&::-webkit-scrollbar]:hidden">
        {favor.data.map((cocktail, index) => (
          <li key={cocktail.id} className="shrink-0">
            <Link
              href={`/detail/${cocktail.id}`}
              aria-label={`${cocktail.name} 상세 보기`}
              className="focus-visible:outline-accent flex rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Avatar
                size="md"
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
