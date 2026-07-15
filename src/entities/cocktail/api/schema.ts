/** 백엔드 /list가 반환하는 칵테일 요약. */
export interface CocktailSummary {
  id: number;
  imageUrl: string | null;
  name: string;
  nameEn: string;
  baseTag: string;
  description: string;
  abv: number;
  glass: string;
}

export interface CocktailListResponse {
  items: CocktailSummary[];
  meta: {
    page: number;
    rpp: number;
    hasNextPage: boolean;
  };
}
