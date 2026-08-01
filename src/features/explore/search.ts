/**
 * 탐색 검색어 입력 규칙.
 *
 * - 최대 40자
 * - 영문 · 한글 · 숫자 · 공백만 허용 (그 외 문자는 입력 단계에서 제거)
 *
 * 허용 문자 집합에 한글 "음절"(가–힣)뿐 아니라 조합 중 잡히는 "자모"
 * (Compatibility Jamo, Jamo)까지 포함한다. IME 조합 중간 값에 잡히는 자모를
 * 제거해버리면 한글 입력이 끊기므로, 유효 입력에 대해서는 sanitize 가
 * 항상 no-op(입력값 그대로) 이 되도록 해 조합을 방해하지 않는다.
 */
export const MAX_QUERY_LENGTH = 40;

/**
 * 검색 공통 개수 상수.
 * 자동완성 요청 limit 과 최근 검색어 보관 개수를 동일하게 맞춘다.
 */
export const SEARCH_LIMIT = 5;

/** 허용 문자(제거 대상의 여집합): 영문 / 한글 음절·자모 / 숫자 / 공백. */
const ALLOWED_CHARS = "a-zA-Z0-9\\uAC00-\\uD7A3\\u3130-\\u318F\\u1100-\\u11FF\\s";
/** 허용되지 않는 문자 — 입력 시 이 문자들을 제거한다. */
const DISALLOWED_RE = new RegExp(`[^${ALLOWED_CHARS}]`, "g");
/** 요청 직전 검증용 — 전체가 허용 문자로만 이루어졌는지. */
const VALID_RE = new RegExp(`^[${ALLOWED_CHARS}]+$`);

/** 입력값에서 허용되지 않는 문자를 제거하고 최대 길이로 자른다. */
export function sanitizeSearchQuery(raw: string): string {
  return raw.replace(DISALLOWED_RE, "").slice(0, MAX_QUERY_LENGTH);
}

/**
 * 자동완성 요청을 보낼 수 있는 검색어인지 검사한다.
 * trim 후: 비어있지 않고, 40자 이하이며, 허용 문자로만 이루어져야 한다.
 */
export function isValidSearchQuery(raw: string): boolean {
  const trimmed = raw.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_QUERY_LENGTH && VALID_RE.test(trimmed);
}
