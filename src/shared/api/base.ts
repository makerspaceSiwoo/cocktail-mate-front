import axios from "axios";

/**
 * 공용 API 인스턴스 (fetcher). baseURL 은 오직 이 한 곳에서만 주입한다.
 * → 엔드포인트/환경을 바꾸려면 이 인스턴스 설정만 수정하면 모든 호출에 반영된다.
 *
 * 각 도메인의 api.ts 는 이 인스턴스를 import 해서 .get()/.post() 를 호출한다.
 */
export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 쿠키 인증 전송 (백엔드 CORS allow_credentials 필요)
  headers: {
    "Content-Type": "application/json",
  },
});

// 인터셉터 자리(필요 시): 예) 401 토큰 refresh, 공통 에러 변환.
// 백엔드 인증이 구현되면 여기에 추가한다.
// API.interceptors.response.use((res) => res, async (error) => { ... });
