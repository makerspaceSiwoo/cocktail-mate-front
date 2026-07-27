/**
 * 칵테일 베이스 태그 공통 맵 (전역 단일 소스).
 *
 * DB 에는 영문 baseTag 가 저장된다. 이 맵을 유일한 소스로 삼아 한글 라벨과
 * 색상을 어디서든(리스트 필터/카드, explore 3D 등) 동일하게 쓴다.
 * 색상은 data-viz 용 고정 hex 로, globals.css §1 주석의 "data viz 고정 색" 예외.
 */

export interface BaseTagInfo {
  /** 한글 표시 이름 */
  label: string;
  /** 대표 색 (data-viz 용 고정 hex) */
  color: string;
}

/** 표시 순서 — 필터/범례가 이 순서를 따른다. */
export const BASE_TAGS = [
  "rum",
  "gin",
  "vodka",
  "whiskey",
  "tequila",
  "brandy",
  "liqueur",
  "non_alcoholic",
  "other",
] as const;

export type BaseTag = (typeof BASE_TAGS)[number];

// 파스텔 톤이되 9종이 서로 구분되게 hue 를 넓게 벌린다.
// 녹색·청녹색·파랑이 비슷해 청녹색(틸)은 제외 → 진은 핑크로, 브랜디는 레드로.
export const BASE_TAG_MAP: Record<BaseTag, BaseTagInfo> = {
  rum: { label: "럼", color: "#f2a878" }, // 피치/오렌지
  whiskey: { label: "위스키", color: "#d4a56e" }, // 카라멜/탠
  tequila: { label: "데킬라", color: "#f0d366" }, // 옐로
  non_alcoholic: { label: "논알콜", color: "#7ed08e" }, // 그린
  gin: { label: "진", color: "#ef97c8" }, // 핑크
  vodka: { label: "보드카", color: "#8fb4ee" }, // 블루
  liqueur: { label: "리큐르", color: "#c39ae8" }, // 라벤더/퍼플
  brandy: { label: "브랜디", color: "#e57373" }, // 레드/코럴
  other: { label: "기타", color: "#b9bec5" }, // 그레이
};

/** 영문/변형 baseTag 를 대표 태그 key 로 정규화한다. (없으면 "other") */
export function normalizeBaseTag(baseTag: string): BaseTag {
  let key = baseTag.trim().toLowerCase().replace(/[\s-]/g, "_");
  if (key === "whisky") key = "whiskey";
  return (BASE_TAGS as readonly string[]).includes(key)
    ? (key as BaseTag)
    : "other";
}

/** baseTag → 정보(한글/색). 미정의 태그는 "기타". */
export function getBaseTagInfo(baseTag: string): BaseTagInfo {
  return BASE_TAG_MAP[normalizeBaseTag(baseTag)];
}

/** baseTag → 한글 라벨. */
export function baseTagLabel(baseTag: string): string {
  return getBaseTagInfo(baseTag).label;
}

/** baseTag → 대표 색(hex). */
export function baseTagColor(baseTag: string): string {
  return getBaseTagInfo(baseTag).color;
}

/**
 * 배경색 위에서 읽기 쉬운 텍스트 색(흰/검)을 고른다. (배지 등 색 위 글자용)
 * 상대 휘도 근사값 기준.
 */
export function readableTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1d1814" : "#ffffff";
}
