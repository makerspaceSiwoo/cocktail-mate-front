export function MyProfileSkeleton() {
  return (
    <section
      aria-label="사용자 정보를 불러오는 중"
      role="status"
      className="bg-profile-bg flex min-h-40 w-full animate-pulse items-center gap-4 px-[22px] pt-10 pb-[26px]"
    >
      <div className="bg-card-bg size-[88px] shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="bg-card-bg h-6 w-32 rounded-md" />
        <div className="bg-card-bg h-3 w-40 rounded-md" />
        <div className="bg-card-bg h-3 w-48 max-w-full rounded-md" />
      </div>
      <span className="sr-only">사용자 정보를 불러오는 중입니다.</span>
    </section>
  );
}
