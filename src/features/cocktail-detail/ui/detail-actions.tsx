"use client";

import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { HeartIcon, ShareIcon } from "@/shared/ui/icon/icons";

export function DetailActions({ title }: { title: string }) {
  const [shared, setShared] = useState(false);

  async function share() {
    const shareData = { title, url: window.location.href };

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
    <div id="detail-actions" className="grid scroll-mt-[70px] grid-cols-2 gap-2 px-[22px] pt-5">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        disabled
        aria-label="좋아요 기능 준비 중"
        className="border-border-soft text-heart h-[50px] rounded-[14px]"
      >
        <HeartIcon size={18} aria-hidden />
        좋아요
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={share}
        className="border-border-soft h-[50px] rounded-[14px]"
      >
        <ShareIcon size={18} aria-hidden />
        {shared ? "링크 복사됨" : "공유"}
      </Button>
    </div>
  );
}
