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

/** 칵테일 재료 1건. */
export interface CocktailIngredient {
  id: number;
  name: string;
  nameEn: string;
  category: string;
  amount: number;
  unit: string;
  description: string;
}

/** 백엔드 /cocktail/{id}가 반환하는 칵테일 상세. */
export interface CocktailDetail {
  id: number;
  name: string;
  nameEn: string;
  imageUrl: string | null;
  glass: string;
  abv: number;
  recipe: string[];
  description: string;
  baseTag: string;
  ingredients: CocktailIngredient[];
}
