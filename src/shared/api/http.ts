const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiFetchOptions extends RequestInit {
  /** Next.js fetch 캐시 재검증 주기(초). 지정 시 ISR 캐싱이 적용된다. */
  revalidate?: number;
}

/**
 * `NEXT_PUBLIC_API_URL` 을 기준으로 하는 최소 fetch 래퍼.
 *
 * - JSON 응답을 파싱해 `T` 로 반환한다.
 * - 2xx 가 아니면 throw 한다 (호출측에서 fallback 처리).
 */
export async function apiFetch<T>(
  path: string,
  { revalidate, ...init }: ApiFetchOptions = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL 이 설정되지 않았습니다.");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init.headers },
    ...(revalidate !== undefined ? { next: { revalidate } } : {}),
  });

  if (!res.ok) {
    throw new Error(`API 요청 실패 (${res.status}): ${path}`);
  }

  return res.json() as Promise<T>;
}
