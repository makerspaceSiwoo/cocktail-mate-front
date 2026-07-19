"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { baseTagLabel, cocktailQueries } from "@/entities/cocktail";

import { type ScenePoint } from "../model";

interface CocktailDetailSheetProps {
  /** 선택된 포인트. null 이면 시트를 닫는다(닫힘 애니메이션 후 언마운트). */
  point: ScenePoint | null;
  onClose: () => void;
}

const SHEET_BASE =
  "absolute inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[430px] flex-col rounded-t-3xl border border-b-0 border-border-soft bg-card-bg px-5.5 pt-3.5 pb-5";

/**
 * 포인트 클릭 시 <main> 하단에서 올라오는 칵테일 상세 시트(bottom sheet).
 *
 * - shared Dialog(뷰포트 고정 + body 포털 + 모달)는 하단 메뉴를 가리고, 캔버스
 *   클릭으로 여는 모달 특성상 "열자마자 닫힘" 이슈가 있어 여기선 <main> 안에
 *   absolute 로 배치하는 가벼운 시트를 직접 만든다. (부모 <main> 은 relative +
 *   overflow-hidden)
 * - 열림/닫힘 모두 CSS 애니메이션으로 부드럽게. 닫힐 때는 애니메이션이 끝난 뒤
 *   (onAnimationEnd) 언마운트한다.
 * - /explore 응답에는 이름·도수·baseTag 만 있으므로 이미지·영문명·설명은
 *   /cocktail/{id} 로 가져온다.
 */
export function CocktailDetailSheet({ point, onClose }: CocktailDetailSheetProps) {
  // 닫힘 애니메이션 동안 마지막 칵테일을 계속 렌더하기 위해 상태를 파생 보관한다.
  const [rendered, setRendered] = useState(point != null);
  const [shown, setShown] = useState<ScenePoint | null>(point);
  if (point) {
    if (!rendered) setRendered(true);
    if (point.id !== shown?.id) setShown(point);
  }
  const closing = point == null && rendered;

  const { data, isPending, isError } = useQuery({
    ...cocktailQueries.detail(shown?.id ?? 0),
    enabled: point != null,
  });

  // ESC 로 닫기
  useEffect(() => {
    if (point == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [point, onClose]);

  if (!rendered || !shown) return null;

  const handleSheetAnimEnd = () => {
    if (closing) setRendered(false);
  };

  const backdrop = (
    <div
      onClick={onClose}
      aria-hidden="true"
      className={`absolute inset-0 z-40 bg-black/40 ${
        closing
          ? "animate-[overlay-fade-out_200ms_ease-in_forwards]"
          : "animate-[overlay-fade-in_200ms_ease-out]"
      }`}
    />
  );

  const sheetAnim = closing
    ? "animate-[dialog-bottom-out_220ms_ease-in_forwards]"
    : "animate-[dialog-bottom-in_240ms_ease-out]";

  const Handle = (
    <div className="mb-3 flex h-[22px] items-center justify-center">
      <div className="h-1 w-9 rounded-full bg-text" aria-hidden="true" />
    </div>
  );

  // 데이터 로딩 중: 시트 정중앙에 "로딩중..." 만 보여준다.
  if (isPending) {
    return (
      <>
        {backdrop}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="칵테일 정보"
          className={`${SHEET_BASE} ${sheetAnim}`}
          onAnimationEnd={handleSheetAnimEnd}
        >
          {Handle}
          <div className="flex min-h-[120px] items-center justify-center">
            <p className="text-[14px] text-muted" role="status">
              로딩중...
            </p>
          </div>
        </div>
      </>
    );
  }

  const name = data?.name ?? shown.name;
  const abv = data?.abv ?? shown.abv;
  const baseKo = baseTagLabel(shown.baseTag);

  return (
    <>
      {backdrop}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cocktail-sheet-title"
        className={`${SHEET_BASE} ${sheetAnim}`}
        onAnimationEnd={handleSheetAnimEnd}
      >
        {Handle}

        <h3
          id="cocktail-sheet-title"
          className="border-b-2 border-warm-400 pb-1 text-[19px] leading-[24px] font-black text-text"
        >
          {name}
          {data?.nameEn ? (
            <span className="ml-1.5 text-[13px] font-medium text-muted">
              ({data.nameEn})
            </span>
          ) : null}
        </h3>

        <div className="mt-3 flex items-center gap-4">
          {/* 아바타 */}
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-chip-bg">
            {data?.imageUrl ? (
              <Image
                src={data.imageUrl}
                alt=""
                fill
                unoptimized
                sizes="64px"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            {isError ? (
              <p className="text-[13px] text-muted">
                칵테일 정보를 불러오지 못했어요.
              </p>
            ) : data?.description ? (
              <p className="text-[13px] leading-[18px] text-muted">
                {data.description}
              </p>
            ) : null}

            <div className="mt-2.5 flex items-center gap-2.5">
              <span className="rounded-full bg-chip-bg px-2.5 py-1 text-[13px] font-bold text-text">
                {baseKo}
              </span>
              {abv != null ? (
                <span className="text-[13px] text-muted">도수 {abv}%</span>
              ) : null}
            </div>
          </div>
        </div>

        {/* 레시피 페이지로 이동 */}
        <Link
          href={`/detail/${shown.id}`}
          className="mt-5 flex items-center justify-center rounded-2xl bg-text py-4 text-[16px] font-bold text-card-bg"
        >
          레시피 보기
        </Link>
      </div>
    </>
  );
}
