import type { Cocktail } from "@/entities/cocktail";
import { Carousel, type CarouselSlide } from "@/shared/ui/carousel";

import { getDailyRecommend } from "../api";

/**
 * 홈: 오늘의 추천 캐러셀. 데이터 fetch 를 이 async 서버 컴포넌트가 들고 있어서
 * <Suspense> 로 감쌀 수 있다(제목·나머지 섹션이 먼저 스트리밍된다).
 *
 * 실패해도 홈 전체를 깨뜨리지 않고 이 섹션만 안내 문구로 대체한다.
 */
export async function DailyRecommendCarousel() {
  let recommended: Cocktail[] = [];
  try {
    recommended = await getDailyRecommend();
  } catch (error: unknown) {
    console.error("오늘의 추천 로드 실패:", error);
  }

  if (!recommended.length) {
    return <p className="text-muted text-sm">추천 칵테일을 불러오지 못했어요.</p>;
  }

  const slides: CarouselSlide[] = recommended.map((cocktail) => ({
    src: cocktail.imageUrl,
    alt: cocktail.name,
    title: cocktail.name,
    description: cocktail.description,
    href: `/detail/${cocktail.id}`,
  }));

  return <Carousel slides={slides} className="h-[280px] w-full" />;
}

/** Carousel 과 동일한 높이로 자리를 잡아 데이터 도착 시 레이아웃이 튀지 않게 한다. */
export function DailyRecommendCarouselSkeleton() {
  return <div className="bg-chip-bg h-[280px] w-full animate-pulse rounded-lg" aria-hidden />;
}
