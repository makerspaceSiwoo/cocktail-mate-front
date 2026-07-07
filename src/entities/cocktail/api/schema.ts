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

export interface SearchResult {
  total: number;
  cocktails: CocktailSummary[];
}

export interface CocktailIngredientDetail {
  id: number;
  name: string;
  nameEn: string | null;
  category: string | null;
  amount: number | null;
  unit: string | null;
  description: string | null;
  abv: number | null;
  imageUrl: string | null;
  potency: number | null;
}

export interface CocktailDetail {
  id: number;
  name: string;
  nameEn: string | null;
  imageUrl: string | null;
  glass: string | null;
  abv: number | null;
  recipe: string[] | null;
  description: string | null;
  baseTag: string | null;
  ingredients: CocktailIngredientDetail[];
}
