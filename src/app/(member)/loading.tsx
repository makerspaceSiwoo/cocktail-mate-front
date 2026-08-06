/**
 * /my 이하 회원 전용 페이지의 loading 경계. MemberLayout 이 BottomNav 를 유지한
 * 채 본문만 이 스켈레톤으로 대체한다.
 */
export default function MemberLoading() {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto" aria-busy="true" aria-label="마이페이지">
      <p className="sr-only" role="status">
        불러오는 중입니다.
      </p>

      <div className="flex flex-col items-center gap-3 px-[22px] pt-10" aria-hidden>
        <div className="bg-chip-bg size-[88px] animate-pulse rounded-full" />
        <div className="bg-chip-bg h-5 w-32 animate-pulse rounded" />
        <div className="bg-chip-bg h-4 w-48 animate-pulse rounded" />
      </div>

      <div className="mt-8 flex flex-col gap-3 px-[22px]" aria-hidden>
        <div className="bg-chip-bg h-16 animate-pulse rounded-[18px]" />
        <div className="bg-chip-bg h-16 animate-pulse rounded-[18px]" />
        <div className="bg-chip-bg h-16 animate-pulse rounded-[18px]" />
      </div>
    </main>
  );
}
