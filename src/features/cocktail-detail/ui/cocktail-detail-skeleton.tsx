import { Card, CardBody, CardHeader } from "@/shared/ui/card";
import { ChevronLeftIcon, ShareIcon } from "@/shared/ui/icon/icons";

/** 재료 행 자리표시자 — 실제 행 높이(min-h-[58px])와 동일. */
const INGREDIENT_ROWS = [0, 1, 2, 3] as const;
/** 레시피 행 자리표시자 — 실제 행 높이(min-h-[72px])와 동일. */
const RECIPE_ROWS = [0, 1, 2] as const;

/** 회색 자리표시자 블록. */
function Bar({ className }: { className: string }) {
  return <div className={`bg-chip-bg animate-pulse rounded ${className}`} />;
}

/**
 * 칵테일 상세 스켈레톤.
 *
 * CocktailDetail 과 섹션 구성·여백·높이를 1:1 로 맞춘다(배너 278px, 본문 여백 22px,
 * 스탯 카드 70px/r16, 본문 카드 r18, 재료 행 58px, 레시피 행 72px). 섹션 제목처럼
 * 데이터와 무관한 텍스트는 실제 문구를 그대로 그려서, 데이터가 도착했을 때 회색
 * 블록이 통째로 갈리는 느낌 대신 내용만 채워지도록 한다.
 *
 * 헤더는 위치·높이만 맞춘 비대화형 껍데기다(뒤로 가기는 브라우저 back 으로 가능).
 */
export function CocktailDetailSkeleton() {
  return (
    <main
      className="bg-bg mx-auto min-h-dvh w-full max-w-[430px] overflow-x-hidden pb-[max(32px,env(safe-area-inset-bottom))]"
      aria-busy="true"
    >
      <p className="sr-only" role="status">
        칵테일 정보를 불러오는 중입니다.
      </p>

      <header
        className="bg-bg/95 sticky top-0 z-20 flex h-[54px] items-center justify-between px-[18px] backdrop-blur"
        aria-hidden
      >
        <span className="text-text flex size-[34px] items-center justify-center rounded-full">
          <ChevronLeftIcon size={25} />
        </span>
        <Bar className="h-5 w-32" />
        <span className="text-muted flex size-[34px] items-center justify-center rounded-full">
          <ShareIcon size={21} />
        </span>
      </header>

      {/*
        배너는 실제 화면과 같은 bg-banner-bg 를 쓴다(이미지가 그 위에 덮이므로 도착
        시점에 배경색이 튀지 않는다). 정지된 빈 상자로 보이지 않게 pulse 만 얹는다.
      */}
      <section aria-hidden>
        <div className="bg-banner-bg relative flex h-[278px] animate-pulse items-center justify-center overflow-hidden">
          <div className="absolute inset-x-8 top-10 h-24 rounded-full bg-white/35 blur-2xl" />
        </div>
      </section>

      <section className="px-[22px] pt-6" aria-hidden>
        <div className="flex flex-col gap-3">
          <div>
            <Bar className="h-4 w-28" />
            <Bar className="mt-1 h-[34px] w-3/5" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Bar className="h-7 w-16 rounded-full" />
            <Bar className="h-7 w-24 rounded-full" />
          </div>
        </div>
      </section>

      {/* DetailActions(좋아요·공유) 자리 — 버튼 높이 50px / r14. */}
      <div className="grid grid-cols-2 gap-2 px-[22px] pt-5" aria-hidden>
        <Bar className="h-[50px] rounded-[14px]" />
        <Bar className="h-[50px] rounded-[14px]" />
      </div>

      <section className="px-[22px] pt-5" aria-hidden>
        <dl className="grid grid-cols-2 gap-2">
          <StatSkeleton label="도수" />
          <StatSkeleton label="재료" />
        </dl>
      </section>

      <section className="px-[22px] pt-5" aria-hidden>
        <Card className="border-border-soft rounded-[18px]">
          <CardHeader className="px-5 pt-5 pb-2">
            <h2 className="text-[16px] leading-5 font-bold">설명</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-2 px-5 pt-0 pb-5">
            <Bar className="h-[15px] w-full" />
            <Bar className="h-[15px] w-11/12" />
            <Bar className="h-[15px] w-2/3" />
          </CardBody>
        </Card>
      </section>

      <section className="px-[22px] pt-4" aria-hidden>
        <Card className="border-border-soft rounded-[18px]">
          <CardHeader className="px-5 pt-5 pb-1">
            <h2 className="text-[16px] leading-5 font-bold">재료</h2>
          </CardHeader>
          <CardBody className="px-5 pt-0 pb-4">
            <dl className="divide-border-soft divide-y">
              {INGREDIENT_ROWS.map((row) => (
                <div
                  key={row}
                  className="grid min-h-[58px] grid-cols-[1fr_auto] items-center gap-3 py-3"
                >
                  <Bar className="h-[15px] w-2/5" />
                  <Bar className="h-[15px] w-12" />
                </div>
              ))}
            </dl>
          </CardBody>
        </Card>
      </section>

      <section className="px-[22px] pt-4" aria-hidden>
        <Card className="border-border-soft rounded-[18px]">
          <CardHeader className="flex flex-row items-center justify-between px-5 pt-5 pb-1">
            <h2 className="text-[16px] leading-5 font-bold">레시피</h2>
          </CardHeader>
          <CardBody className="px-5 pt-0 pb-4">
            <ol className="divide-border-soft divide-y">
              {RECIPE_ROWS.map((row) => (
                <li
                  key={row}
                  className="grid min-h-[72px] grid-cols-[32px_1fr] items-center gap-3 py-4"
                >
                  <div className="bg-chip-bg size-8 animate-pulse rounded-full" />
                  <div className="flex min-w-0 flex-col gap-2">
                    <Bar className="h-[15px] w-full" />
                    <Bar className="h-[15px] w-3/4" />
                  </div>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </section>
    </main>
  );
}

function StatSkeleton({ label }: { label: string }) {
  return (
    <Card className="border-border-soft flex min-h-[70px] flex-col justify-center rounded-[16px] px-3">
      <dt className="text-muted text-[12px] leading-4">{label}</dt>
      <dd className="mt-1">
        <Bar className="h-5 w-14" />
      </dd>
    </Card>
  );
}
