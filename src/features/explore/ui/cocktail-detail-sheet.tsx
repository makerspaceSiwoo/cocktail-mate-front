"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import {
  baseTagColor,
  baseTagLabel,
  cocktailQueries,
  readableTextColor,
} from "@/entities/cocktail";
import { BottomSheet } from "@/shared/ui/bottom-sheet";

import { type ScenePoint } from "../model";

interface CocktailDetailSheetProps {
  /** 선택된 포인트. null 이면 시트를 닫는다(닫힘 애니메이션 후 언마운트). */
  point: ScenePoint | null;
  onClose: () => void;
}

const SHEET_TITLE_ID = "cocktail-sheet-title";

/**
 * 포인트 선택 시 <main> 하단에서 올라오는 칵테일 상세 시트.
 *
 * - 시트 크롬(올라오기·드래그로 닫기·핸들·백드롭)은 공용 `BottomSheet` 가 담당하고,
 *   여기서는 칵테일 상세 내용만 children 으로 얹는다. 부모 <main> 은 relative +
 *   overflow-hidden 이어야 한다(시트가 컨텐츠 영역 안에서만 뜨고 하단 nav 를 안 가림).
 * - /explore 응답에는 이름·도수·baseTag 만 있으므로 이미지·영문명·설명은
 *   /cocktail/{id} 로 가져온다.
 */
export function CocktailDetailSheet({ point, onClose }: CocktailDetailSheetProps) {
  // 닫힘 애니메이션 동안 마지막 칵테일을 계속 렌더하기 위해 파생 보관한다.
  const [shown, setShown] = useState<ScenePoint | null>(point);
  if (point && point.id !== shown?.id) setShown(point);

  const { data, isPending, isError } = useQuery({
    ...cocktailQueries.detail(shown?.id ?? 0),
    enabled: point != null,
  });

  const isLoading = shown != null && isPending;

  return (
    <BottomSheet
      open={point != null}
      onClose={onClose}
      ariaLabel={isLoading ? "칵테일 정보" : undefined}
      ariaLabelledby={isLoading ? undefined : SHEET_TITLE_ID}
    >
      {shown == null ? null : isLoading ? (
        <div className="flex min-h-[120px] items-center justify-center">
          <p className="text-muted text-[14px]" role="status">
            로딩중...
          </p>
        </div>
      ) : (
        <>
          <h3
            id={SHEET_TITLE_ID}
            className="border-warm-400 text-text text-4 border-b-2 pb-1 leading-6 font-black"
          >
            {data?.name ?? shown.name}
            {data?.nameEn ? (
              <span className="text-muted ml-1.5 text-[13px] font-medium">{data.nameEn}</span>
            ) : null}
          </h3>

          <div className="mt-3 flex items-center gap-4">
            {/* 아바타 */}
            <div className="bg-chip-bg relative size-14 shrink-0 overflow-hidden rounded-full">
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
                <p className="text-muted text-[13px]">칵테일 정보를 불러오지 못했어요.</p>
              ) : data?.description ? (
                <p className="text-muted text-xs leading-4">{data.description}</p>
              ) : null}

              <div className="mt-2.5 flex items-center gap-2.5">
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: baseTagColor(shown.baseTag),
                    color: readableTextColor(baseTagColor(shown.baseTag)),
                  }}
                >
                  {baseTagLabel(shown.baseTag)}
                </span>
                {(data?.abv ?? shown.abv) != null ? (
                  <span className="text-muted text-xs">도수 {data?.abv ?? shown.abv}%</span>
                ) : null}
              </div>
            </div>
          </div>

          {/* 레시피 페이지로 이동 */}
          <Link
            href={`/detail/${shown.id}`}
            className="bg-text text-card-bg text-4 mt-3 flex items-center justify-center rounded-xl py-2 font-bold"
          >
            레시피 보기
          </Link>
        </>
      )}
    </BottomSheet>
  );
}
