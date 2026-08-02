"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { cocktailQueries } from "@/entities/cocktail";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";

import { RecommendCard, type RecommendCardData } from "./recommend-card";

interface TasteResultProps {
  /** 폼에서 선택한 descriptorId 목록. 빈 배열이면 랜덤 추천. */
  descriptorIds: number[];
}

function ResultMessage({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-0 flex-1 items-center justify-center p-6">
      <p className="text-muted text-center text-sm break-keep">{children}</p>
    </main>
  );
}

/**
 * 취향 추천 결과. /flavor/recommend 응답을 그대로 카드로 노출한다. 응답에 없는
 * 값(영문명·도수 등)은 억지로 채우지 않고 미노출한다 — 백엔드가 해당 필드를
 * 응답에 추가(배포)하면 자동으로 표시된다. 결과는 스크롤 스냅 카드로 넘겨보고,
 * 하단 "레시피 보기"로 현재 카드의 상세 페이지로 이동한다.
 */
export function TasteResult({ descriptorIds }: TasteResultProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const recommend = useQuery(cocktailQueries.flavorRecommend(descriptorIds));
  const items = recommend.data ?? [];

  // 스크롤 스냅 컨테이너에서 가운데에 가장 가까운 카드를 현재 인덱스로 잡는다
  // (gap 이 있어도 자식의 실제 위치 기준으로 정확히 계산).
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const node = child as HTMLElement;
      const childCenter = node.offsetLeft + node.offsetWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setIndex(best);
  }, []);

  if (recommend.isLoading) return <ResultMessage>추천 결과를 불러오는 중…</ResultMessage>;
  if (recommend.isError)
    return <ResultMessage>추천 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요.</ResultMessage>;
  if (items.length === 0)
    return (
      <ResultMessage>
        조건에 맞는 추천 결과가 없어요. 다른 취향으로 다시 시도해보세요.
      </ResultMessage>
    );

  // 응답에 있는 값만 사용하고, 없는 필드(nameEn·abv 등)는 null → 카드에서 미노출.
  const cards: RecommendCardData[] = items.map((item) => ({
    id: item.id,
    name: item.name,
    nameEn: item.nameEn ?? null,
    image: item.imageUrl ?? "",
    description: item.description ?? "",
    abv: item.abv ?? null,
  }));

  const current = cards[Math.min(index, cards.length - 1)];

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
      <header className="flex shrink-0 flex-col gap-1">
        <h1 className="text-xl font-bold">취향 추천 결과</h1>
        <p className="text-muted text-sm break-keep">
          당신의 취향에 맞는 칵테일이에요. 넘겨보고 레시피를 확인해보세요.
        </p>
      </header>

      {/* 카드(페이지 70% 높이)를 세로 중앙에 두고, 아래 간격 후 레시피 버튼. */}
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 py-4">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-[80%] snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card) => (
            <div key={card.id} className="h-full w-full shrink-0 snap-center snap-always">
              <RecommendCard card={card} />
            </div>
          ))}
        </div>

        {cards.length > 1 ? (
          <div className="flex shrink-0 items-center justify-center gap-1.5" aria-hidden>
            {cards.map((card, i) => (
              <span
                key={card.id}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  i === index ? "bg-text" : "bg-border",
                )}
              />
            ))}
          </div>
        ) : null}

        <Button
          type="button"
          variant="cta"
          size="lg"
          fullWidth
          className="shrink-0"
          onClick={() => router.push(`/detail/${current.id}`)}
        >
          레시피 보기
        </Button>
      </div>
    </main>
  );
}
