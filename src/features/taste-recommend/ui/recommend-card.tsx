import Image from "next/image";

/** 추천 결과 카드에 표시할 데이터 (추천 응답 + 상세 보강 병합 결과). */
export interface RecommendCardData {
  id: number;
  name: string;
  nameEn?: string | null;
  image: string;
  description: string;
  abv?: number | null;
}

/**
 * 취향 추천 결과 카드 — 사진 + 이름 + 영문명 + 도수 + 설명을 한 카드 안에 담는다.
 * 설명은 잘리지 않고 wrap 되며, 내용이 길면 정보 영역이 세로 스크롤된다.
 */
export function RecommendCard({ card }: { card: RecommendCardData }) {
  return (
    <article className="border-border-soft bg-card-bg flex h-full w-full flex-col overflow-hidden rounded-3xl border">
      {/* 사진 — 카드 상단 55% */}
      <div className="relative w-full shrink-0 basis-[55%]">
        {card.image ? (
          <Image
            src={card.image}
            alt={card.name}
            fill
            sizes="(max-width: 430px) 100vw, 430px"
            className="object-cover"
          />
        ) : (
          <div className="bg-chip-bg absolute inset-0" aria-hidden />
        )}
      </div>

      {/* 정보 — 남은 영역을 채우고, 설명이 길면 이 안에서 스크롤 */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h2 className="text-text text-xl font-bold break-keep">{card.name}</h2>
          {card.abv != null && (
            <span className="bg-chip-bg text-text shrink-0 rounded-full px-2.5 py-1 text-xs font-medium">
              도수 {card.abv}%
            </span>
          )}
        </div>

        {card.nameEn ? <p className="text-muted text-sm">{card.nameEn}</p> : null}

        {card.description ? (
          <p className="text-text/90 text-sm leading-relaxed break-keep whitespace-pre-wrap">
            {card.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}
