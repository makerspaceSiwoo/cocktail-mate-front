"use client";

import { useMemo, useState } from "react";

import type { DailyRecommendation } from "@/entities/cocktail";
import { Carousel, type CarouselSlide } from "@/shared/ui/carousel";

const FALLBACK_IMAGES = [
  "/images/cosmopolitan-example.jpg",
  "/images/mojito-example.jpg",
  "/images/margarita-example.jpg",
  "/images/negroni-example.jpg",
] as const;

const FALLBACK_DESCRIPTION = "오늘 CocktailMate가 추천하는 한 잔이에요.";

interface TodayRecommendationsProps {
  recommendations: DailyRecommendation[];
}

export function TodayRecommendations({ recommendations }: TodayRecommendationsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const slides = useMemo<CarouselSlide[]>(
    () =>
      recommendations.map((recommendation, index) => ({
        src: recommendation.imageUrl ?? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
        alt: `${recommendation.name} 칵테일`,
        title: recommendation.name,
        description: recommendation.description ?? FALLBACK_DESCRIPTION,
      })),
    [recommendations],
  );

  return (
    <section aria-labelledby="today-recommendations-title">
      <div className="flex h-9 items-center px-[22px] py-1.5">
        <h1
          id="today-recommendations-title"
          className="text-base leading-none font-bold tracking-[-0.02em]"
        >
          오늘의 추천
        </h1>
      </div>

      {slides.length > 0 ? (
        <>
          <div className="px-4 pt-1">
            <Carousel
              slides={slides}
              className="h-[220px] w-full rounded-[18px]"
              onIndexChange={setSelectedIndex}
              renderOverlay={({ slide, index, count }) => {
                const recommendation = recommendations[index];

                return (
                  <div className="flex h-full flex-col justify-end gap-1.5 bg-gradient-to-b from-transparent via-black/15 to-black/55 px-[22px] py-[22px] text-white">
                    <h2 className="truncate font-serif text-2xl leading-none font-bold tracking-[-0.02em]">
                      {slide.title}
                    </h2>
                    <p className="line-clamp-2 text-xs leading-[18px] text-white">
                      {slide.description}
                    </p>
                    <div className="flex h-6 items-center justify-between">
                      <span className="rounded-full bg-black/32 px-3 py-[5px] text-[11.5px] leading-none font-semibold backdrop-blur-sm">
                        도수 {formatAbv(recommendation?.abv)}
                      </span>
                      <span className="rounded-full bg-black/32 px-3 py-[5px] text-[11.5px] leading-none font-semibold backdrop-blur-sm">
                        {index + 1}/{count}
                      </span>
                    </div>
                  </div>
                );
              }}
            />
          </div>

          {slides.length > 1 ? (
            <div
              className="flex h-[30px] items-start justify-center gap-1.5 pt-2.5"
              aria-label={`${slides.length}개 추천 중 ${selectedIndex + 1}번째`}
            >
              {slides.map((slide, index) => (
                <span
                  key={`${slide.src}-${index}`}
                  aria-hidden="true"
                  className={
                    index === selectedIndex
                      ? "bg-accent h-1.5 w-[18px] rounded-full"
                      : "bg-border size-1.5 rounded-full"
                  }
                />
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <div className="bg-card-bg text-muted mx-4 flex h-[220px] items-center justify-center rounded-[18px] px-6 text-center text-sm">
          오늘의 추천을 불러오지 못했어요. 잠시 후 다시 확인해 주세요.
        </div>
      )}
    </section>
  );
}

function formatAbv(abv: number | null | undefined) {
  if (abv == null) return "정보 없음";
  return `${Number.isInteger(abv) ? abv : abv.toFixed(1)}%`;
}
