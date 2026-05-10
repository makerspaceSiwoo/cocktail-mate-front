export interface Cocktail {
  id: string;
  name: string;
  spirit: string;
  desc: string;
  abv: number;
  difficulty: string;
  views?: string;
  likes?: number;
  color: string;
  tint: string;
  tag?: string;
  alias?: string;
  alt?: string;
}
