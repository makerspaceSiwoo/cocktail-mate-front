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

/** 검색(/search) 응답 메타. 목록 메타에 totalCount 를 더한 형태. */
export interface CocktailSearchMeta {
  page: number;
  rpp: number;
  /** 전체 검색 결과 수. */
  totalCount: number;
  hasNextPage: boolean;
}

/** `GET /search` 응답. items 는 목록과 동일한 요약 형태. */
export interface CocktailSearchResponse {
  items: CocktailSummary[];
  meta: CocktailSearchMeta;
}

/** /search/autocomplete 추천 검색어 1건. */
export interface CocktailSuggestion {
  id: number;
  name: string;
  nameEn: string;
}

/** 좋아요 랭킹(GET /ranking) 1건. 전체 좋아요 수 기준 상위 칵테일. */
export interface RankingItem {
  id: number;
  name: string;
  imageUrl: string | null;
  likeCount: number;
}

/** `GET /ranking` 응답. */
export interface RankingResponse {
  items: RankingItem[];
}

/** 취향 선택지 1건 (GET /taste-descriptors). category 로 그룹핑한다. */
export interface TasteDescriptor {
  id: number;
  code: string;
  labelKo: string;
  /** taste_chemosensory · fruit · aroma · mouthfeel · finish · body · temperature · alcohol */
  category: string;
}

/** `GET /taste-descriptors` 응답. */
export interface TasteDescriptorCatalog {
  items: TasteDescriptor[];
  /** 카테고리당 최대 선택 수 (백엔드 계약상 1). */
  maxSelectionsPerCategory: number;
}

/**
 * `POST /flavor/recommend` 응답 1건.
 * 백엔드가 아직 imageUrl·description 을 채우지 않을 수 있어 optional 이며,
 * 없으면 화면에서 GET /cocktail/{id} 상세로 보강한다(하이브리드).
 */
export interface FlavorRecommendItem {
  id: number;
  name: string;
  nameEn?: string | null;
  similarity: number;
  imageUrl?: string | null;
  description?: string | null;
  abv?: number | null;
}

/** A cocktail returned by GET /cocktail/{id}/recommend. */
export interface CocktailRecommendation {
  id: number;
  name: string;
  similarity: number;
  imageUrl: string | null;
}

/** A cocktail returned by GET /user/favor — the signed-in user's like-based recommendation. */
export interface CocktailFavor {
  id: number;
  name: string;
  similarity: number;
  imageUrl: string | null;
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
  isLiked: boolean;
  likeCount: number;
  ingredients: CocktailIngredientDetail[];
}
