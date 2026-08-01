import type { Cocktail } from "@/entities/cocktail";
import { FavorRecommendations } from "@/features/favor-recommend";
import { Carousel, type CarouselSlide } from "@/shared/ui/carousel";

interface HomePageProps {
  recommended: Cocktail[];
}

export function HomePage({ recommended }: HomePageProps) {
  const slides: CarouselSlide[] = recommended.map((cocktail) => ({
    src: cocktail.imageUrl,
    alt: cocktail.name,
    title: cocktail.name,
    description: cocktail.description,
    href: `/detail/${cocktail.id}`,
  }));

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">오늘의 추천</h2>
        {slides.length > 0 ? (
          <Carousel slides={slides} className="h-[280px] w-full" />
        ) : (
          <p className="text-muted text-sm">추천 칵테일을 불러오지 못했어요.</p>
        )}
      </section>

      <FavorRecommendations />
    </main>
  );
}
