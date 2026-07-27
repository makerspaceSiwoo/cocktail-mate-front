"use client";

import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type TransitionEvent as ReactTransitionEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/shared/lib";

export interface BottomSheetProps {
  /** 열림 여부. false 가 되면 닫힘 애니메이션 후 언마운트한다. */
  open: boolean;
  /** 닫기 요청(백드롭 클릭·ESC·드래그 임계값 초과). */
  onClose: () => void;
  /** 시트 본문. */
  children: ReactNode;
  /** 접근성 레이블. 제목이 본문 안에 있으면 `ariaLabelledby` 를 대신 넘긴다. */
  ariaLabel?: string;
  /** 본문 안 제목 요소의 id (설정 시 `ariaLabel` 대신 사용). */
  ariaLabelledby?: string;
  /** 상단 드래그 핸들 숨김. */
  hideHandle?: boolean;
  /** 시트 패널에 덧붙일 className. */
  className?: string;
}

/**
 * 컨테이너 하단에서 올라오는 바텀시트.
 *
 * - 위치: 뷰포트 `fixed` 가 아니라 **가장 가까운 relative 조상 기준 `absolute`**.
 *   → 하단 탭바 등을 덮지 않고 컨텐츠 영역 안에서만 뜬다. 소비처는 시트를 감싸는
 *   조상에 `relative`(+ 넘침 클리핑용 `overflow-hidden`)를 둔다.
 * - 열림/백드롭·ESC 닫힘은 CSS keyframe 로 부드럽게. 시트를 손가락(마우스)으로 잡고
 *   아래로 끌면 따라 내려가고, 임계값을 넘겨 놓으면 아래로 슬라이드하며 닫힌다
 *   (일반 바텀시트 제스처). 첫 pointerdown 에 수동 transform 모드로 전환한다.
 */

const SHEET_BASE =
  "absolute inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[430px] touch-none flex-col rounded-t-3xl border border-b-0 border-border-soft bg-card-bg px-5.5 pt-3.5 pb-5 select-none";

/** 아래로 이만큼(px) 넘게 끌면 닫는다. */
const DRAG_CLOSE_THRESHOLD = 100;

export function BottomSheet({
  open,
  onClose,
  children,
  ariaLabel,
  ariaLabelledby,
  hideHandle = false,
  className,
}: BottomSheetProps) {
  // 닫힘 애니메이션 동안에도 렌더를 유지하기 위해 열림 상태를 파생 보관한다.
  const [rendered, setRendered] = useState(open);
  // 드래그(끌어내리기) 상태
  const [manualControl, setManualControl] = useState(false); // 한 번이라도 잡았으면 inline transform
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  if (open && !rendered) {
    setRendered(true);
    // 새로 열릴 때 드래그 상태 초기화(직전 드래그 값이 남지 않게).
    setManualControl(false);
    setDragPx(0);
    setIsDragging(false);
  }
  const closing = !open && rendered;

  // ESC 로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!rendered) return null;

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
    setIsDragging(false);
    if (shouldClose) {
      onClose(); // → closing → onTransitionEnd 에서 언마운트
    } else {
      setDragPx(0); // 스냅백
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "absolute inset-0 z-40 bg-black/40",
          closing
            ? "animate-[overlay-fade-out_200ms_ease-in_forwards]"
            : "animate-[overlay-fade-in_200ms_ease-out]",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabelledby ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={cn(SHEET_BASE, sheetAnim, className)}
        style={sheetStyle}
        onAnimationEnd={handleSheetAnimEnd}
        onTransitionEnd={handleTransitionEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {!hideHandle ? (
          <div className="mb-3 flex h-[22px] items-center justify-center">
            <div className="bg-text h-1 w-9 rounded-full" aria-hidden="true" />
          </div>
        ) : null}
        {children}
      </div>
    </>
  );
}
