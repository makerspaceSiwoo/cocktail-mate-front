import { type RankingItem } from "@/entities/cocktail";

import { getRanking } from "../api";
import { LikesRanking } from "./likes-ranking";

/** 스켈레톤에 그릴 자리표시자 개수. 기본 limit(10) 중 첫 화면에 보이는 만큼. */
const PLACEHOLDERS = [0, 1, 2, 3, 4] as const;

/**
 * 홈: 좋아요 랭킹 섹션. 데이터 fetch 를 이 async 서버 컴포넌트가 들고 있어서
 * <Suspense> 로 감쌀 수 있다.
 *
 * 실패하면 빈 배열이 되고, LikesRanking 이 섹션 자체를 렌더하지 않는다.
 */
export async function LikesRankingSection() {
  let items: RankingItem[] = [];
  try {
    items = await getRanking();
  } catch (error: unknown) {
    console.error("좋아요 랭킹 로드 실패:", error);
  }

  return <LikesRanking items={items} />;
}

/** LikesRanking 과 동일한 제목·행 높이로 자리를 잡는다. */
export function LikesRankingSectionSkeleton() {
  return (
    <section className="flex flex-col gap-3" aria-busy="true">
      <h2 className="text-lg font-bold">좋아요 랭킹</h2>
      <ol className="flex gap-1 overflow-hidden pb-1" aria-hidden>
        {PLACEHOLDERS.map((placeholder) => (
          <li key={placeholder} className="flex w-20 shrink-0 flex-col items-center gap-2 p-1">
            <div className="bg-chip-bg size-16 animate-pulse rounded-full" />
            <div className="bg-chip-bg h-[2.75em] w-full animate-pulse rounded" />
            <div className="bg-chip-bg h-3 w-8 animate-pulse rounded" />
          </li>
        ))}
      </ol>
    </section>
  );
}
