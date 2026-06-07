/** 백엔드 /list, /search 등이 반환하는 칵테일 요약 (현재는 mock 응답). */
export interface CocktailSummary {
  id: number;
  imageUrl: string;
  name: string;
  baseTag: string;
  description: string;
  ABV: number;
  numLike: number;
}

export interface SearchResult {
  total: number;
  cocktails: CocktailSummary[];
}
