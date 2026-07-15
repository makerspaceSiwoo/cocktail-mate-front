export interface DailyRecommendation {
  id: number;
  name: string;
  description: string | null;
  baseTag: string | null;
  abv: number | null;
  imageUrl: string | null;
}

export interface DailyRecommendationResponse {
  items: DailyRecommendation[];
}
