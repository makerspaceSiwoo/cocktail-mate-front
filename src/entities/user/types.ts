export type Provider = "local" | "kakao";

export interface User {
  id: number;
  email: string;
  nickname: string;
  provider: Provider;
  profile_image_url: string | null;
}
