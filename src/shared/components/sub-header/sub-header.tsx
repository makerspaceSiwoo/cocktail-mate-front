"use client";

import { useGoBack } from "@/shared/hooks";
import { shareCurrentPage } from "@/shared/lib/share-current-page";
import { IconButton } from "@/shared/ui/button";
import { ChevronLeftIcon, ShareIcon } from "@/shared/ui/icon/icons";

interface SubHeaderProps {
  /** 가운데 제목. 생략하면 제목 없이 뒤로가기/공유만 노출한다. */
  title?: string;
  /** 공유 버튼 노출 여부. 기본 false. */
  showShare?: boolean;
  /** 공유 시 사용할 제목. 생략하면 문서 제목/현재 title 을 사용한다. */
  shareTitle?: string;
}

/**
 * 하위 페이지 공통 상단 헤더 — 뒤로가기 '<' + (옵션) 공유 버튼.
 * 칵테일 상세 헤더와 동일한 레이아웃이며, 제목/공유 노출을 선택할 수 있다.
 */
export function SubHeader({ title, showShare = false, shareTitle }: SubHeaderProps) {
  const goBack = useGoBack();

  async function share() {
    try {
      await shareCurrentPage(shareTitle ?? title ?? document.title);
    } catch {
      // 사용자가 공유 창을 닫은 경우 현재 화면을 유지한다.
    }
  }

  return (
    <header className="bg-bg/95 sticky top-0 z-20 flex h-[54px] shrink-0 items-center justify-between px-[18px] backdrop-blur">
      <button
        type="button"
        onClick={goBack}
        aria-label="뒤로 가기"
        className="text-text flex size-[34px] cursor-pointer items-center justify-center rounded-full"
      >
        <ChevronLeftIcon size={25} aria-hidden />
      </button>

      {title ? (
        <h1 className="max-w-[240px] min-w-0 truncate text-center text-[17px] leading-5 font-bold">
          {title}
        </h1>
      ) : null}

      {showShare ? (
        <IconButton
          aria-label="공유하기"
          onClick={share}
          variant="ghost"
          size="sm"
          className="rounded-full"
          icon={<ShareIcon size={21} aria-hidden />}
        />
      ) : (
        // 뒤로가기 버튼과 대칭을 맞춰 제목이 가운데 오도록 자리만 차지한다.
        <span aria-hidden className="size-[34px]" />
      )}
    </header>
  );
}
