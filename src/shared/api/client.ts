/**
 * 인증 aware fetch 래퍼.
 *
 * - credentials: "include" 기본 (HttpOnly 쿠키 전송)
 * - 401 응답 시 POST /auth/refresh 1회 시도 → 성공하면 원 요청 재시도
 * - refresh 실패 또는 auth 엔드포인트 자체 401 → 전역 로그아웃 처리
 * - 재시도 루프 방지: auth 경로나 refresh 자체 요청엔 인터셉터 미적용
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** FastAPI 에러 응답 형식 */
export type ApiError = {
  detail: string | { msg: string; type: string }[];
};

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: ApiError["detail"],
  ) {
    const message =
      typeof detail === "string" ? detail : detail.map((d) => d.msg).join(", ");
    super(message);
    this.name = "HttpError";
  }
}

/** 전역 로그아웃 콜백 — AuthProvider가 마운트 시 등록한다 */
let _onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(fn: () => void) {
  _onUnauthorized = fn;
}

export function unregisterUnauthorizedHandler() {
  _onUnauthorized = null;
}

let _isRefreshing = false;
let _refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (_isRefreshing && _refreshPromise) return _refreshPromise;
  _isRefreshing = true;
  _refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      _isRefreshing = false;
      _refreshPromise = null;
    }
  })();
  return _refreshPromise;
}

/**
 * 401→refresh 인터셉터를 건너뛸 경로.
 * - /auth/refresh: 재시도 루프 방지 (refresh 자체가 실패한 것)
 * - /auth/login, /auth/logout: 로그인/로그아웃 엔드포인트에서 401은 재시도 불필요
 * - /auth/email/*, /auth/signup: 사전 인증 이메일 관련 엔드포인트
 * ※ /auth/me 는 앱 부팅 시 주요 401 발생 경로이므로 인터셉터 적용 대상
 */
function isAuthPath(path: string): boolean {
  return (
    path === "/auth/refresh" ||
    path === "/auth/login" ||
    path === "/auth/logout" ||
    path.startsWith("/auth/email/") ||
    path.startsWith("/auth/signup")
  );
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
  skipInterceptor = false,
): Promise<T> {
  const url = `${API_URL}${path}`;

  const defaultHeaders: HeadersInit = {};
  // Content-Type은 FormData일 때는 설정하지 않음 (boundary 자동 처리)
  if (!(init.body instanceof FormData)) {
    (defaultHeaders as Record<string, string>)["Content-Type"] =
      "application/json";
  }

  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      ...defaultHeaders,
      ...(init.headers ?? {}),
    },
  });

  // 401 인터셉터: auth 경로·재시도 플래그가 없을 때만 동작
  if (res.status === 401 && !skipInterceptor && !isAuthPath(path)) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      // 원 요청 재시도 (skipInterceptor=true로 루프 방지)
      return apiFetch<T>(path, init, true);
    } else {
      _onUnauthorized?.();
      throw new HttpError(401, "인증이 만료되었습니다. 다시 로그인해주세요.");
    }
  }

  if (!res.ok) {
    let detail: ApiError["detail"] = res.statusText;
    try {
      const body = (await res.json()) as ApiError;
      detail = body.detail ?? detail;
    } catch {
      // JSON 파싱 실패 시 statusText 유지
    }
    throw new HttpError(res.status, detail);
  }

  // 빈 응답 처리 (204 No Content 등)
  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
