"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";

export type AlertDialogVariant = "alert" | "confirm";

export interface AlertDialogProps {
  /** 열림 상태(controlled). */
  open: boolean;
  /** 닫힘/취소 핸들러 — 오버레이·ESC·(confirm)취소 버튼에서 호출. */
  onClose: () => void;
  /**
   * - "alert": 확인 버튼만 (단순 안내/완료). **기본값**
   * - "confirm": 취소 + 확인 버튼 (파괴적/선택 확인).
   */
  variant?: AlertDialogVariant;
  /** 제목(굵게, 중앙). Radix 접근성 Title 로도 사용. */
  title: string;
  /** 설명(muted, 중앙). 줄바꿈(\n) 반영. */
  description?: string;
  /** 상단 원형 아이콘(선택). SVG 는 `fill="currentColor"` 로 두면 accent 색 상속. */
  icon?: React.ReactNode;
  /** 확인 버튼 텍스트. 기본 "확인". */
  confirmText?: string;
  /** 취소 버튼 텍스트(confirm 전용). 기본 "취소". */
  cancelText?: string;
  /** 확인 버튼 클릭 핸들러. 없으면 onClose 호출. */
  onConfirm?: () => void;
  /** 오버레이 클릭·ESC 로 닫기 허용. 기본 true. */
  dismissible?: boolean;
  /** 패널에 추가할 className. */
  className?: string;
}

/**
 * 중앙 정렬 안내/확인 다이얼로그. 화면 dim + 마진 있는 카드(전체폭 아님).
 * 텍스트 중앙 정렬, title/description 분리, alert/confirm 두 variant.
 */
export function AlertDialog({
  open,
  onClose,
  variant = "alert",
  title,
  description,
  icon,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  dismissible = true,
  className,
}: AlertDialogProps) {
  const handleConfirm = onConfirm ?? onClose;

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && dismissible) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-40 bg-black/40",
            "animate-[overlay-fade-in_200ms_ease-out]",
          )}
        />
        <DialogPrimitive.Content
          onEscapeKeyDown={(e) => {
            if (!dismissible) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (!dismissible) e.preventDefault();
          }}
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
        >
          {/* 마진 있는 중앙 카드 (전체폭 X). 안쪽 요소만 애니메이션. */}
          <div
            className={cn(
              "flex w-80 max-w-[calc(100vw-48px)] flex-col items-center text-center",
              "rounded-2xl border border-border-soft bg-card-bg p-6 shadow-2xl",
              "animate-[dialog-center-in_200ms_ease-out]",
              className,
            )}
          >
            {icon ? (
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-chip-bg text-accent">
                {icon}
              </div>
            ) : null}

            <DialogPrimitive.Title className="text-[16px] font-bold leading-tight text-text">
              {title}
            </DialogPrimitive.Title>

            {description ? (
              <DialogPrimitive.Description className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-muted">
                {description}
              </DialogPrimitive.Description>
            ) : (
              <DialogPrimitive.Description className="sr-only">
                {title}
              </DialogPrimitive.Description>
            )}

            <div
              className={cn(
                "mt-6 flex w-full gap-3",
                variant === "alert" ? "flex-col" : "flex-row",
              )}
            >
              {variant === "confirm" ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="flex-1 text-[16px]"
                  onClick={onClose}
                >
                  {cancelText}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="cta"
                size="lg"
                className={cn(
                  "text-[16px]",
                  variant === "confirm" ? "flex-1" : "w-full",
                )}
                onClick={handleConfirm}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
