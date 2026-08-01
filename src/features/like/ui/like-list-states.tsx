"use client";

import { HeartFilledIcon } from "@/shared/ui/icon/icons";

interface LikeListErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function LikeListLoadingState({ message = "좋아요 목록을 불러오는 중..." }) {
  return (
    <div className="text-muted flex items-center justify-center gap-2 py-10 text-sm" role="status">
      <span
        className="border-border border-t-accent size-5 animate-spin rounded-full border-2"
        aria-hidden
      />
      <span>{message}</span>
    </div>
  );
}

export function LikeListErrorState({
  message = "좋아요 목록을 불러오지 못했습니다.",
  onRetry,
}: LikeListErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-9 text-center" role="alert">
      <p className="text-muted text-sm">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="border-border text-text focus-visible:ring-accent rounded-xl border px-4 py-2 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-card-bg)]"
      >
        다시 시도
      </button>
    </div>
  );
}

export function LikeListEmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-9 text-center">
      <span className="text-border" aria-hidden>
        <HeartFilledIcon size={28} />
      </span>
      <p className="text-text text-sm font-bold">좋아하는 칵테일을 모아보세요</p>
      <p className="text-muted text-xs">목록이나 상세 화면에서 하트를 눌러 추가할 수 있어요.</p>
    </div>
  );
}
