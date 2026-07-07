"use client";

import { useState } from "react";

import { HeartFilledIcon, ShareIcon } from "@/shared/ui/icon/icons";

export function DetailActions() {
  const [shared, setShared] = useState(false);

  async function share() {
    const shareData = { title: document.title, url: window.location.href };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setShared(true);
      }
    } catch {
      // 사용자가 공유 창을 닫은 경우 현재 화면을 유지한다.
    }
  }

  return (
    <div id="detail-actions" className="flex h-[70px] scroll-mt-[70px] gap-2 px-[18px] pt-4">
      <button
        type="button"
        disabled
        aria-label="좋아요 기능 준비 중"
        className="border-border-soft bg-card-bg text-heart flex h-[50px] flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-[14px] border text-sm font-bold opacity-70"
      >
        <HeartFilledIcon size={22} aria-hidden />
        좋아요
      </button>
      <button
        type="button"
        onClick={share}
        className="border-border-soft bg-card-bg text-muted flex h-[50px] flex-1 items-center justify-center gap-2 rounded-[14px] border text-sm font-medium"
      >
        <ShareIcon size={22} aria-hidden />
        {shared ? "링크 복사됨" : "공유"}
      </button>
    </div>
  );
}
