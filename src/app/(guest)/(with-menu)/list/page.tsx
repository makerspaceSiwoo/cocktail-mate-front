import type { Metadata } from "next";
import Link from "next/link";

import {
  FilterIcon,
  GlassIcon,
  HeartFilledIcon,
  HeartIcon,
  SearchIcon,
} from "@/shared/ui/icon/icons";

export const metadata: Metadata = {
  title: "칵테일 목록 | CocktailMate",
  description: "베이스별 칵테일 레시피를 탐색합니다.",
};

type CocktailBase = "데킬라" | "럼" | "위스키" | "진" | "보드카";

type Cocktail = {
  id: string;
  name: string;
  base: CocktailBase;
  description: string;
  difficulty: "쉬움" | "중" | "보통";
  abv: number;
  likes: string;
  liked: boolean;
};

const CATEGORIES = ["전체", "보드카", "진", "럼", "위스키", "데킬라"] as const;

const BASE_BADGE_CLASS: Record<CocktailBase, string> = {
  데킬라: "bg-banner-bg",
  럼: "bg-chip-bg",
  위스키: "bg-cream-200",
  진: "bg-profile-bg",
  보드카: "bg-border-soft",
};

const IMAGE_TINT_CLASS: Record<CocktailBase, string> = {
  데킬라: "bg-cream-50",
  럼: "bg-chip-bg",
  위스키: "bg-banner-bg",
  진: "bg-profile-bg",
  보드카: "bg-border-soft",
};

const COCKTAILS: Cocktail[] = [
  {
    id: "margarita",
    name: "마가리타",
    base: "데킬라",
    description: "상큼하고 짭짤한 클래식 칵테일",
    difficulty: "중",
    abv: 18,
    likes: "12.4k",
    liked: true,
  },
  {
    id: "mojito",
    name: "모히토",
    base: "럼",
    description: "상쾌한 민트 향의 여름 칵테일",
    difficulty: "쉬움",
    abv: 13,
    likes: "8.7k",
    liked: true,
  },
  {
    id: "old-fashioned",
    name: "올드 패션드",
    base: "위스키",
    description: "깊고 진한 풍미의 클래식 칵테일",
    difficulty: "쉬움",
    abv: 35,
    likes: "15.2k",
    liked: true,
  },
  {
    id: "martini",
    name: "마티니",
    base: "진",
    description: "드라이하고 우아한 칵테일의 정석",
    difficulty: "중",
    abv: 28,
    likes: "9.3k",
    liked: false,
  },
  {
    id: "negroni",
    name: "네그로니",
    base: "진",
    description: "쌉싸름한 캄파리와 진의 선명한 균형",
    difficulty: "중",
    abv: 24,
    likes: "7.2k",
    liked: false,
  },
];

export default function ListPage() {
  return (
    <main className="bg-bg mx-auto flex min-h-dvh w-full max-w-[375px] flex-col overflow-x-hidden pt-[38px] pb-[85px]">
      <header className="flex h-[50px] items-start justify-between px-[22px] pt-[15px]">
        <Link
          href="/home"
          aria-label="CocktailMate 홈으로 이동"
          className="text-text text-[22px] leading-[29px] font-black tracking-normal"
        >
          CocktailMate
        </Link>
        <Link
          href="/search"
          aria-label="칵테일 검색"
          className="text-text flex size-8 items-center justify-center"
        >
          <SearchIcon size={24} aria-hidden />
        </Link>
      </header>

      <section className="flex h-[50px] items-start px-[22px] pt-[14px]">
        <div>
          <h1 className="text-text text-[28px] leading-[34px] font-black tracking-normal">
            레시피
          </h1>
          <div className="bg-accent mt-1 h-0.5 w-[84px]" />
        </div>
      </section>

      <nav aria-label="칵테일 베이스 필터" className="h-[60px] overflow-x-auto">
        <ul className="flex w-max items-center gap-1 px-[22px] pt-[14px]">
          {CATEGORIES.map((category) => {
            const active = category === "전체";
            const widthClass =
              category === "전체"
                ? "w-14"
                : category === "진" || category === "럼"
                  ? "w-11"
                  : "w-[68px]";

            return (
              <li key={category}>
                <button
                  type="button"
                  aria-pressed={active}
                  className={`${widthClass} h-8 rounded-full text-[14px] leading-8 font-bold whitespace-nowrap ${
                    active ? "bg-text text-bg" : "text-muted bg-transparent"
                  }`}
                >
                  {category}
                </button>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              aria-label="필터"
              className="text-text flex h-9 w-[26px] items-center justify-end"
            >
              <FilterIcon size={20} aria-hidden />
            </button>
          </li>
        </ul>
      </nav>

      <section aria-label="칵테일 레시피 목록">
        <ul>
          {COCKTAILS.map((cocktail) => (
            <li key={cocktail.id}>
              <Link
                href={`/detail/${cocktail.id}`}
                className="border-border-soft mx-[22px] grid h-28 grid-cols-[64px_1fr_24px] items-start gap-3 border-b"
              >
                <div
                  className={`mt-6 size-16 rounded-full ${IMAGE_TINT_CLASS[cocktail.base]}`}
                  aria-hidden
                />

                <article className="mt-4 min-w-0">
                  <h2 className="text-text truncate text-[18px] leading-[21px] font-black tracking-normal">
                    {cocktail.name}
                  </h2>

                  <p className="text-muted mt-1.5 flex min-w-0 items-center gap-2 text-[12px] leading-[19px]">
                    <span
                      className={`text-text h-[19px] shrink-0 rounded-full px-2 text-[12px] leading-[19px] font-black ${BASE_BADGE_CLASS[cocktail.base]}`}
                    >
                      {cocktail.base}
                    </span>
                    <span aria-hidden className="text-border">
                      |
                    </span>
                    <span className="truncate">{cocktail.description}</span>
                  </p>

                  <dl className="text-muted mt-1.5 flex items-center gap-[10px] text-[12px] leading-[13px] whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <GlassIcon size={12} aria-hidden />
                      <dt className="sr-only">난이도</dt>
                      <dd>난이도 {cocktail.difficulty}</dd>
                    </div>
                    <span aria-hidden className="bg-border h-2.5 w-px" />
                    <div>
                      <dt className="sr-only">도수</dt>
                      <dd>도수 {cocktail.abv}%</dd>
                    </div>
                    <span aria-hidden className="bg-border h-2.5 w-px" />
                    <div className="flex items-center gap-1">
                      <HeartIcon size={12} aria-hidden />
                      <dt className="sr-only">좋아요</dt>
                      <dd>{cocktail.likes}</dd>
                    </div>
                  </dl>
                </article>

                <span className="text-heart mt-[62px] flex justify-end" aria-hidden>
                  {cocktail.liked ? <HeartFilledIcon size={18} /> : <HeartIcon size={18} />}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
