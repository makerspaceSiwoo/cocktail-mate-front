import type { Cocktail } from "./types";

export const COCKTAIL_FIXTURES: Cocktail[] = [
  {
    id: "negroni",
    name: "네그로니",
    alias: "내그로니",
    spirit: "진",
    desc: "쓴맛과 단맛의 완벽한 밸런스",
    abv: 24,
    difficulty: "중",
    views: "12.5K",
    likes: 7600,
    color: "#5b1d1a",
    tint: "#f1d9d4",
  },
  {
    id: "mojito",
    name: "모히토",
    spirit: "럼",
    desc: "상쾌한 민트 향의 여름 칵테일",
    abv: 13,
    difficulty: "쉬움",
    views: "9.8K",
    likes: 8700,
    color: "#7fb069",
    tint: "#e2eed8",
  },
  {
    id: "margarita",
    name: "마가리타",
    spirit: "데킬라",
    desc: "상큼하고 짭짤한 클래식 칵테일",
    abv: 18,
    difficulty: "중",
    views: "8.3K",
    likes: 12400,
    color: "#d8d97a",
    tint: "#f1f1d8",
  },
  {
    id: "old-fashioned",
    name: "올드 패션드",
    spirit: "위스키",
    desc: "깊고 진한 풍미의 클래식 칵테일",
    abv: 35,
    difficulty: "쉬움",
    views: "15.2K",
    likes: 15200,
    color: "#7a3a1c",
    tint: "#ecd9cb",
  },
  {
    id: "martini",
    name: "마티니",
    spirit: "진",
    desc: "드라이하고 우아한 칵테일의 정석",
    abv: 28,
    difficulty: "중",
    views: "9.3K",
    likes: 9300,
    color: "#c2c8a3",
    tint: "#ebede0",
  },
  {
    id: "pina-colada",
    name: "피나 콜라다",
    alt: "피냐 콜라다",
    spirit: "럼",
    desc: "달콤하고 부드러운 열대 스타일 칵테일",
    abv: 13,
    difficulty: "쉬움",
    views: "11.1K",
    likes: 11100,
    color: "#f0e3c4",
    tint: "#f6efde",
  },
  {
    id: "blue-hawaii",
    name: "블루 하와이",
    spirit: "럼",
    desc: "바다처럼 푸른 트로피컬",
    abv: 12,
    difficulty: "쉬움",
    views: "6.4K",
    color: "#3aa6d4",
    tint: "#d4ebf4",
  },
  {
    id: "gin-tonic",
    name: "진 토닉",
    spirit: "진",
    desc: "가장 사랑받는 하이볼",
    abv: 10,
    difficulty: "쉬움",
    views: "14.0K",
    color: "#dceae0",
    tint: "#eaf2ec",
  },
  {
    id: "cosmopolitan",
    name: "코스모폴리탄",
    spirit: "보드카",
    desc: "상큼한 라임과 크랜베리의 조화,\n세련된 분위기를 완성하는 칵테일",
    abv: 20,
    difficulty: "중",
    views: "10.2K",
    color: "#c33756",
    tint: "#f0d4dc",
  },
  {
    id: "virgin-mojito",
    name: "버진 모히토",
    spirit: "무알콜",
    tag: "무알콜",
    desc: "상큼한 민트의 상쾌함이 가득한 무알콜 모히토",
    abv: 0,
    difficulty: "쉬움",
    views: "2.3K",
    likes: 2300,
    color: "#a4c98a",
    tint: "#e3eed5",
  },
  {
    id: "classic-mojito",
    name: "클래식 모히토",
    spirit: "럼",
    desc: "상쾌한 민트와 라임의 조화가 일품인 클래식 모히토",
    abv: 13,
    difficulty: "보통",
    views: "12.4K",
    likes: 12400,
    color: "#7fb069",
    tint: "#e2eed8",
  },
];

export const COCKTAILS_BY_ID: Record<string, Cocktail> = Object.fromEntries(
  COCKTAIL_FIXTURES.map((c) => [c.id, c]),
);

export const CATEGORIES = [
  "전체",
  "보드카",
  "진",
  "럼",
  "위스키",
  "데킬라",
  "브랜디",
  "칵테일",
];

export const RECENT_SEARCHES = [
  "모히토",
  "마가리타",
  "블루 하와이",
  "위스키 사워",
  "진 토닉",
];

export function formatLikes(n: number | undefined): string {
  if (n == null) return "0";
  if (n >= 1000) {
    const k = n / 1000;
    return (k >= 10 ? Math.round(k) : Number(k.toFixed(1))) + "k";
  }
  return String(n);
}
