/** 백엔드 /list가 반환하는 칵테일 요약. */
export interface CocktailSummary {
  id: number;
  imageUrl: string | null;
  name: string;
  nameEn: string | null;
  baseTag: string | null;
  description: string | null;
  abv: number | null;
  glass: string | null;
  isLiked: boolean;
}

export interface CocktailListResponse {
  items: CocktailSummary[];
  meta: {
    page: number;
    rpp: number;
    hasNextPage: boolean;
  };
}

/** /search/autocomplete 추천 검색어 1건. */
export interface CocktailSuggestion {
  id: number;
  name: string;
  nameEn: string;
}

/** 백엔드 /search/autocomplete 응답. */
export interface AutocompleteResponse {
  keyword: string;
  items: CocktailSuggestion[];
}

/** 칵테일 재료 1건. */
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

/** 백엔드 /cocktail/{id}가 반환하는 칵테일 상세. */
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
