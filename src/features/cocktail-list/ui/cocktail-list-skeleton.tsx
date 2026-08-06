/** 필터 칩 자리표시자 폭(px). 실제 베이스 태그 라벨 길이에 맞춘 대략치. */
const CHIP_WIDTHS = [56, 64, 72, 60, 68, 76] as const;

/** 목록 행 자리표시자 개수. 첫 화면(≈932px)을 채울 만큼만 그린다. */
const ROWS = [0, 1, 2, 3, 4, 5, 6] as const;

/**
 * /list 의 스켈레톤. loading.tsx 와 page.tsx 의 Suspense fallback 이 함께 쓴다.
 *
 * 헤더·필터 칩 영역은 CocktailList 와 동일한 높이(50px / 60px)·여백(22px)으로
 * 그려서, 데이터가 도착해 실제 목록으로 교체될 때 레이아웃이 튀지 않게 한다.
 */
export function CocktailListSkeleton() {
  return (
    <main
      className="bg-bg flex min-h-0 w-full flex-1 flex-col overflow-hidden"
      aria-busy="true"
      aria-label="칵테일 레시피 목록"
    >
      <section className="flex h-[50px] items-start px-[22px]">
        <div className="flex flex-col gap-1">
          <h1 className="text-text text-[28px] leading-[34px] font-black tracking-normal">
            칵테일
          </h1>
          <div className="bg-accent h-0.5 w-[84px]" />
        </div>
      </section>

      <div className="h-[60px] overflow-hidden" aria-hidden>
        <ul className="flex w-max items-center gap-1 px-[22px] pt-[14px]">
          {CHIP_WIDTHS.map((width, index) => (
            <li
              key={index}
              className="bg-chip-bg h-8 animate-pulse rounded-full"
              style={{ width }}
            />
          ))}
        </ul>
      </div>

      <p className="sr-only" role="status">
        칵테일 목록을 불러오는 중입니다.
      </p>

      <div className="min-h-0 flex-1 overflow-hidden" aria-hidden>
        <ul>
          {ROWS.map((row) => (
            <li
              key={row}
              className="border-border-soft grid h-28 grid-cols-[64px_minmax(0,1fr)_44px] items-center gap-3 border-b px-[22px]"
            >
              <div className="bg-chip-bg size-16 animate-pulse rounded-full" />
              <div className="grid min-w-0 gap-2">
                <div className="bg-chip-bg h-[21px] w-2/5 animate-pulse rounded" />
                <div className="bg-chip-bg h-[19px] w-4/5 animate-pulse rounded" />
                <div className="bg-chip-bg h-[13px] w-1/4 animate-pulse rounded" />
              </div>
              <div />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
