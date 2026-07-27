"use client";

import {
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent as ReactTransitionEvent,
  useEffect,
  useRef,
  useState,
} from "react";
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
  "absolute inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[430px] touch-none flex-col rounded-t-3xl border border-b-0 border-border-soft bg-card-bg px-5.5 pt-3.5 pb-5 select-none";

/** 아래로 이만큼(px) 넘게 끌면 닫는다. */
const DRAG_CLOSE_THRESHOLD = 100;

/**
 * 포인트 클릭 시 <main> 하단에서 올라오는 칵테일 상세 시트(bottom sheet).
 *
 * - shared Dialog(뷰포트 고정 + body 포털 + 모달)는 하단 메뉴를 가리고, 캔버스
 *   클릭으로 여는 모달 특성상 "열자마자 닫힘" 이슈가 있어 여기선 <main> 안에
 *   absolute 로 배치하는 가벼운 시트를 직접 만든다. (부모 <main> 은 relative +
 *   overflow-hidden)
 * - 초기 열림/백드롭·ESC 닫힘은 CSS keyframe 로 부드럽게. 시트를 손가락(마우스)으로
 *   잡고 아래로 끌면 따라 내려가고, 임계값을 넘겨 놓으면 아래로 슬라이드하며 닫힌다
 *   (일반 바텀시트 제스처). 드래그가 시작되면(첫 pointerdown) 수동 transform 모드로
 *   전환한다.
 * - /explore 응답에는 이름·도수·baseTag 만 있으므로 이미지·영문명·설명은
 *   /cocktail/{id} 로 가져온다.
 */
export function CocktailDetailSheet({ point, onClose }: CocktailDetailSheetProps) {
  // 닫힘 애니메이션 동안 마지막 칵테일을 계속 렌더하기 위해 상태를 파생 보관한다.
  const [rendered, setRendered] = useState(point != null);
  const [shown, setShown] = useState<ScenePoint | null>(point);
  // 드래그(끌어내리기) 상태
  const [manualControl, setManualControl] = useState(false); // 한 번이라도 잡았으면 inline transform
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  if (point) {
    if (!rendered) {
      setRendered(true);
      // 새로 열릴 때 드래그 상태 초기화(직전 드래그 값이 남지 않게).
      setManualControl(false);
      setDragPx(0);
      setIsDragging(false);
    }
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

  // 드래그를 시작했으면(manualControl) inline transform, 아니면 CSS keyframe.
  const useKeyframe = !manualControl;
  const sheetAnim = useKeyframe
    ? closing
      ? "animate-[dialog-bottom-out_220ms_ease-in_forwards]"
      : "animate-[dialog-bottom-in_240ms_ease-out]"
    : "";
  const sheetStyle = manualControl
    ? {
        // 닫는 중이면 화면 밖(120%)까지, 아니면 손가락 따라(dragPx).
        transform: closing ? "translateY(120%)" : `translateY(${dragPx}px)`,
        // transition 을 켜고/끄는 대신 지속시간만 토글한다(드래그 중 0ms=즉시 추적,
        // 놓으면 250ms). none↔active 로 바꾸면 값 변경과 같은 프레임이라 애니메이션이
        // 트리거되지 않기 때문.
        transition: `transform ${isDragging ? 0 : 250}ms ease-out`,
      }
    : undefined;

  const handleSheetAnimEnd = () => {
    // keyframe 로 닫는 경우 애니메이션 끝나면 언마운트.
    if (useKeyframe && closing) setRendered(false);
  };
  const handleTransitionEnd = (e: ReactTransitionEvent<HTMLDivElement>) => {
    // 드래그로 닫는 경우 슬라이드가 끝나면 언마운트(자식 transition 은 무시).
    if (manualControl && closing && e.target === e.currentTarget) setRendered(false);
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (closing) return;
    // 링크/버튼 위에서 시작한 포인터는 드래그로 취급하지 않는다(탭 = 이동).
    if ((e.target as HTMLElement).closest("a,button")) return;
    setManualControl(true);
    setIsDragging(true);
    startY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dy = e.clientY - startY.current;
    setDragPx(dy > 0 ? dy : 0); // 아래로만 끌린다.
  };
  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const sheet = e.currentTarget;
    sheet.releasePointerCapture?.(e.pointerId);
    const shouldClose = dragPx > DRAG_CLOSE_THRESHOLD;
    // transition 을 켜고 강제 reflow 후 목표 transform 을 설정해, 값 변경이 이미
    // "활성화된" transition 위에서 일어나게 한다 → 동기적으로 애니메이션 트리거.
    // (rAF/타이머에 의존하지 않음)
    sheet.style.transition = "transform 250ms ease-out";
    void sheet.offsetHeight; // 강제 reflow
    sheet.style.transform = shouldClose ? "translateY(120%)" : "translateY(0px)";
    // React 상태 동기화(재렌더가 위와 같은 값을 세팅하도록).
    setIsDragging(false);
    if (shouldClose) {
      onClose(); // → closing → onTransitionEnd 에서 언마운트
    } else {
      setDragPx(0); // 스냅백
    }
  };

  const dialogProps = {
    className: `${SHEET_BASE} ${sheetAnim}`,
    style: sheetStyle,
    onAnimationEnd: handleSheetAnimEnd,
    onTransitionEnd: handleTransitionEnd,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
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

  const Handle = (
    <div className="mb-3 flex h-[22px] items-center justify-center">
      <div className="bg-text h-1 w-9 rounded-full" aria-hidden="true" />
    </div>
  );

  // 데이터 로딩 중: 시트 정중앙에 "로딩중..." 만 보여준다.
  if (isPending) {
    return (
      <>
        {backdrop}
        <div role="dialog" aria-modal="true" aria-label="칵테일 정보" {...dialogProps}>
          {Handle}
          <div className="flex min-h-[120px] items-center justify-center">
            <p className="text-muted text-[14px]" role="status">
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
      <div role="dialog" aria-modal="true" aria-labelledby="cocktail-sheet-title" {...dialogProps}>
        {Handle}

        <h3
          id="cocktail-sheet-title"
          className="border-warm-400 text-text text-4 border-b-2 pb-1 leading-6 font-black"
        >
          {name}
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
              <span className="bg-chip-bg text-text rounded-full px-2.5 py-1 text-xs font-bold">
                {baseKo}
              </span>
              {abv != null ? <span className="text-muted text-xs">도수 {abv}%</span> : null}
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
      </div>
    </>
  );
}
