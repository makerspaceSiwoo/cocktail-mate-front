import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { notifyUnauthorized, tryRefresh } from "./client";

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

/** 재시도 1회만 허용하기 위한 플래그를 붙인 요청 설정. */
type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// refresh 인터셉터를 건너뛸 경로 (재시도 루프 방지). refresh 자체/로그아웃의 401 은
// 갱신 대상이 아니다.
const AUTH_SKIP_PATHS = ["/auth/refresh", "/auth/logout"];

/**
 * 401 → refresh → 원요청 재시도 인터셉터.
 * access_token 만료 시(로그인 필수 API: /like, /user/favor 등) refresh_token 으로
 * 세션을 갱신하고 원요청을 한 번 재시도한다. refresh 가 실패하면 전역 로그아웃 처리.
 * apiFetch(client.ts) 와 동일한 single-flight refresh 를 공유한다.
 */
API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = config?.url ?? "";
    const skip = AUTH_SKIP_PATHS.some((path) => url.includes(path));

    if (status === 401 && config && !config._retry && !skip) {
      config._retry = true;
      const refreshed = await tryRefresh();
      if (refreshed) return API(config);
      notifyUnauthorized();
    }

    return Promise.reject(error);
  },
);
