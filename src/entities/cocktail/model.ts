/**
 * 칵테일 도메인 모델.
 *
 * `/daily-recommend` 등 목록 응답의 개별 아이템 형태.
 */
export interface Cocktail {
  id: number;
  name: string;
  description: string;
  /** 베이스 주류 태그 (예: "진", "럼"). */
  baseTag: string;
  /** 도수 (Alcohol By Volume, %). */
  abv: number;
  imageUrl: string;
}
