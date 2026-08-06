/**
 * 칵테일 상세의 loading 경계. CocktailDetail 과 같은 배너(278px)·본문 여백(22px)으로
 * 자리를 잡아, 목록/랭킹에서 넘어올 때 즉시 이동 + 스켈레톤이 되게 한다.
 */
export default function DetailLoading() {
  return (
    <main
      className="bg-bg mx-auto min-h-dvh w-full max-w-[430px] overflow-x-hidden"
      aria-busy="true"
    >
      <p className="sr-only" role="status">
        칵테일 정보를 불러오는 중입니다.
      </p>

      <section aria-hidden>
        <div className="bg-banner-bg relative flex h-[278px] items-center justify-center overflow-hidden">
          <div className="bg-card-bg size-[190px] animate-pulse rounded-full" />
        </div>
      </section>

      <section className="flex flex-col gap-3 px-[22px] pt-6" aria-hidden>
        <div className="bg-chip-bg h-4 w-24 animate-pulse rounded" />
        <div className="bg-chip-bg h-[34px] w-3/5 animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="bg-chip-bg h-7 w-20 animate-pulse rounded-full" />
          <div className="bg-chip-bg h-7 w-16 animate-pulse rounded-full" />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2 px-[22px] pt-5" aria-hidden>
        <div className="bg-chip-bg h-16 animate-pulse rounded-[18px]" />
        <div className="bg-chip-bg h-16 animate-pulse rounded-[18px]" />
      </section>

      <section className="px-[22px] pt-5" aria-hidden>
        <div className="bg-chip-bg h-32 animate-pulse rounded-[18px]" />
      </section>

      <section className="px-[22px] pt-4" aria-hidden>
        <div className="bg-chip-bg h-48 animate-pulse rounded-[18px]" />
      </section>
    </main>
  );
}
