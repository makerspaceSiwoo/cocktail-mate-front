export type Provider = "kakao" | "google";

export interface User {
  id: number;
  email: string | null; // 소셜 프로필에 이메일이 없을 수 있음
  nickname: string;
  provider: Provider;
  profile_image_url: string | null;
}
