export interface LikeRequest {
  cocktailId: number;
}

export interface LikeActionResponse {
  cocktailId: number;
  isLiked: boolean;
  likeCount: number;
  message: string;
}

export interface LikedCocktail {
  cocktailId: number;
  cocktailName: string;
  imageUrl: string;
  baseTag: string;
  likeCount: number;
  isLiked: boolean;
}

export interface LikeListResponse {
  cocktails: LikedCocktail[];
}
