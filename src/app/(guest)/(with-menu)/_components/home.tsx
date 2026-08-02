import type { Cocktail, RankingItem } from "@/entities/cocktail";
import { FavorRecommendations } from "@/features/favor-recommend";
import { LikesRanking } from "@/features/likes-ranking";
import { TasteBanner } from "@/features/taste-recommend";
import { Carousel, type CarouselSlide } from "@/shared/ui/carousel";

interface HomePageProps {
  recommended: Cocktail[];
  ranking: RankingItem[];
}

export function HomePage({ recommended, ranking }: HomePageProps) {
  const slides: CarouselSlide[] = recommended.map((cocktail) => ({
    src: cocktail.imageUrl,
    alt: cocktail.name,
    title: cocktail.name,
    description: cocktail.description,
    href: `/detail/${cocktail.id}`,
  }));

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">오늘의 추천</h2>
        {slides.length > 0 ? (
          <Carousel slides={slides} className="h-[280px] w-full" />
        ) : (
          <p className="text-muted text-sm">추천 칵테일을 불러오지 못했어요.</p>
        )}
      </section>

      {/* 좋아요 랭킹 → 나를 위한 Pick(로그인 시에만 렌더) → 추천 배너 순. */}
      <LikesRanking items={ranking} />

      <FavorRecommendations />

      <TasteBanner />
    </main>
  );
}
