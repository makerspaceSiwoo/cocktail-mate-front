"use client";

import * as React from "react";

import { cn } from "@/shared/lib";
import { ClockIcon, CloseIcon, SearchIcon } from "@/shared/ui/icon/icons";
import { Input, type InputProps } from "@/shared/ui/input";

/** 자동완성 추천 검색어 한 건. 사용처가 검색 API 결과를 매핑해 주입한다. */
export interface SearchSuggestion {
  /** 항목 고유 id — 상세 화면으로 바로 이동하는 등 id 기반 실행에 사용. */
  id: string | number;
  /** 화면에 노출되고, 텍스트 그대로 검색할 때 쓰이는 라벨. */
  label: string;
}

export interface SearchBarProps extends Omit<InputProps, "shape" | "onSubmit"> {
  /** 바깥 form 래퍼에 적용할 클래스. (input 은 pill 로 고정) */
  className?: string;

  // ── autocomplete 모드 (fetchSuggestions 제공 시 활성화) ────────
  /**
   * 자동완성 조회 API(주입). 이 prop 을 주면 **autocomplete 모드**가 된다:
   * 입력창 아래에 추천 검색어 드롭다운을 띄운다.
   *
   * 컴포넌트가 onChange 를 디바운스해서(마지막 입력 후 `debounceMs`) 트림된
   * 키워드로 이 함수를 실행하고, 반환한 목록을 보관해 드롭다운에 노출한다.
   * - 조회 대기 중(디바운스/로딩)에는 직전 결과를 유지해 빈 목록이 깜빡이지 않음.
   * - 응답이 빈 목록이면 "'{키워드}' 검색 결과가 없어요" 를 노출한다.
   *
   * autocomplete 모드가 아니면(=이 함수를 주지 않으면) 드롭다운 없이 순수 입력만.
   */
  fetchSuggestions?: (keyword: string) => Promise<SearchSuggestion[]>;
  /** onChange 디바운스(ms). autocomplete 모드에서만 적용. 기본 300. */
  debounceMs?: number;
  /**
   * true 면 현재 입력값이 추천 목록의 **첫 번째 항목(echo)** 이 된다.
   * autocomplete 모드는 항상 first-suggestion(첫 항목 자동 선택)으로 검색되므로:
   * - echo=true  → 엔터/기본 선택 = 입력값(echo)으로 검색 → onSubmit
   * - echo=false → 엔터/기본 선택 = 첫 번째 추천으로 검색 → onSelectSuggestion
   * 화살표로 다른 항목을 고르거나 항목을 클릭하면 그 항목으로 검색된다. 기본 false.
   */
  echo?: boolean;
  /**
   * 추천/최근 검색어 항목 선택 시(첫 항목 자동 · 화살표 · 클릭). id 기반 실행에 쓴다.
   * 최근 검색어도 id 를 가진 항목이라 이 콜백으로 처리된다(텍스트가 아니라 항목).
   */
  onSelectSuggestion?: (suggestion: SearchSuggestion) => void;
  /**
   * echo(현재 입력값)로 텍스트 검색될 때만 호출된다(echo=true).
   * autocomplete + echo 가 아니면(=echo 없이 목록으로만 검색) 호출되지 않는다.
   */
  onSubmit?: (keyword: string) => void;

  // ── 최근 검색어 (autocomplete 모드, 입력 없이 포커스 시) ──────
  /**
   * 최근 검색어 목록(주입). id+label 을 가진 항목으로, 입력이 비어 있고 포커스
   * 상태일 때 노출된다. 선택하면 `onSelectSuggestion` 으로 나가 id 기반 실행이
   * 가능하다(키워드↔id 매핑 보장).
   */
  recentSearches?: SearchSuggestion[];
  /** 최근 검색어 행의 ×(삭제) 클릭 시 호출. 목록 갱신은 사용처가 담당. */
  onRemoveRecent?: (recent: SearchSuggestion) => void;
}

/** 스크롤 영역 최대 높이 — 약 5개 행이 보이고 그 이상은 스크롤된다(행 높이 2.75rem). */
const DROPDOWN_LIST_MAX_H = "max-h-[13.75rem]";

/** query 와 겹치는 부분을 accent 볼드로 강조. (대소문자 무시) */
function highlightMatch(label: string, query: string): React.ReactNode {
  const q = query.trim();
  if (!q) return label;
  const idx = label.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return label;
  return (
    <>
      {label.slice(0, idx)}
      <span className="text-accent font-bold">{label.slice(idx, idx + q.length)}</span>
      {label.slice(idx + q.length)}
    </>
  );
}

/**
 * pill 형태 검색 입력 컴포넌트 (+ 선택적 autocomplete 드롭다운).
 *
 * `fetchSuggestions` 를 주면 autocomplete 모드가 켜진다:
 * - 입력하면 onChange 를 디바운스해 추천을 조회하고 입력창 아래에 목록을 띄운다.
 * - 항상 first-suggestion 으로 검색된다(엔터 = 목록 첫 항목). `echo` 로 첫 항목을
 *   현재 입력값으로 둘지 결정한다.
 * - 입력이 비어 있고 포커스 상태면 `recentSearches`(최근 검색어)를 보여준다.
 * `fetchSuggestions` 가 없으면 순수 pill 입력으로 동작한다(엔터 → onSubmit).
 */
export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      placeholder = "검색",
      "aria-label": ariaLabel,
      fetchSuggestions,
      debounceMs = 300,
      echo = false,
      onSelectSuggestion,
      onSubmit,
      recentSearches,
      onRemoveRecent,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      ...inputProps
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

    const listId = React.useId();
    const [open, setOpen] = React.useState(false);
    // 방향키로 활성화된 항목 인덱스. -1 = 없음(기본).
    const [activeIndex, setActiveIndex] = React.useState(-1);

    // controlled(value 지정) 면 value 를, 아니면 내부 상태를 사용.
    const isControlled = value !== undefined;
    const [innerQuery, setInnerQuery] = React.useState(() => String(defaultValue ?? ""));
    const query = isControlled ? String(value ?? "") : innerQuery;
    const trimmed = query.trim();
    const showingSuggestions = trimmed.length > 0;

    const autocompleteMode = fetchSuggestions !== undefined;

    // 최신 fetchSuggestions 를 ref 로 들고 있어 디바운스 effect 가 매 렌더 리셋되지 않게.
    const fetchRef = React.useRef(fetchSuggestions);
    React.useEffect(() => {
      fetchRef.current = fetchSuggestions;
    });

    // 마지막으로 완료된 조회 { keyword, items }. keyword 로 settled/loading 을 구분.
    const [lastResult, setLastResult] = React.useState<{
      keyword: string;
      items: SearchSuggestion[];
    } | null>(null);
    const searchSeq = React.useRef(0);

    // onChange 디바운스: 입력이 멈추면(debounceMs) fetchSuggestions 실행.
    // 응답이 뒤늦게 도착해 순서가 꼬이지 않도록 seq 로 최신 요청만 반영한다.
    React.useEffect(() => {
      if (!autocompleteMode || !trimmed) return;
      const timer = setTimeout(() => {
        const seq = ++searchSeq.current;
        const fn = fetchRef.current;
        if (!fn) return;
        Promise.resolve(fn(trimmed))
          .then((items) => {
            if (seq === searchSeq.current) {
              setLastResult({ keyword: trimmed, items: items ?? [] });
            }
          })
          .catch(() => {
            /* 조회 실패 시 직전 결과를 그대로 유지 */
          });
      }, debounceMs);
      return () => clearTimeout(timer);
    }, [autocompleteMode, trimmed, debounceMs]);

    // form 바깥(캔버스 등)을 누르면 드롭다운을 닫고 input 포커스를 해제한다.
    // WebGL 캔버스는 pointerdown 에서 preventDefault 를 호출해 input 의 blur 가
    // 발생하지 않으므로, onBlur 만으로는 닫히지 않는다. 문서 레벨(capture)에서
    // form 바깥 클릭을 직접 감지해 닫아준다. (input 은 pill 을 눌러야만 열린다)
    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: PointerEvent) => {
        const form = innerRef.current?.closest("form");
        if (form && e.target instanceof Node && !form.contains(e.target)) {
          setOpen(false);
          setActiveIndex(-1);
          innerRef.current?.blur();
        }
      };
      document.addEventListener("pointerdown", onPointerDown, true);
      return () => document.removeEventListener("pointerdown", onPointerDown, true);
    }, [open]);

    // 표시할 추천 목록 = 마지막 완료 결과(현재 키워드면 최신, 아니면 이전 결과).
    const items = lastResult?.items ?? [];
    // 현재 키워드에 대한 응답이 도착(settled)했는지.
    const settled = lastResult !== null && lastResult.keyword === trimmed;
    // 응답이 빈 목록이면 "검색 결과 없음"(로딩 중엔 이전 결과 노출, 안 띄움).
    const showNoResults = showingSuggestions && settled && items.length === 0;
    // echo: 입력이 있으면 현재 키워드를 첫 항목으로.
    const showEcho = autocompleteMode && echo && showingSuggestions;

    const dropdownEnabled = autocompleteMode;
    const hasRecent = (recentSearches?.length ?? 0) > 0;
    const panelOpen = dropdownEnabled && open && (showingSuggestions || hasRecent);

    // 현재 노출 목록의 길이 — 방향키 이동 범위(에코 포함).
    const activeLen = showingSuggestions
      ? items.length + (showEcho ? 1 : 0)
      : (recentSearches?.length ?? 0);

    const optionId = (i: number) => `${listId}-opt-${i}`;
    // 활성 행 강조. 마우스 hover 는 각 행의 onMouseMove 로 활성 인덱스를 잡는다
    // (onMouseEnter 를 쓰면 드롭다운이 커서 아래에 "뜨는" 순간에도 발화해
    //  activeIndex 가 미리 잡혀, 첫 방향키가 첫 항목이 아닌 다음 항목으로 넘어간다).
    const rowClass = (i: number) =>
      cn(
        "flex min-h-11 cursor-pointer items-center gap-3 px-[18px] py-2 transition-colors",
        i === activeIndex && "bg-chip-bg",
      );

    const closeDropdown = () => {
      setOpen(false);
      setActiveIndex(-1);
      innerRef.current?.blur();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInnerQuery(e.target.value);
      // 입력이 바뀌면 목록이 갱신되므로 활성 항목을 초기화한다.
      setActiveIndex(-1);
      // 입력이 비면 결과를 초기화(다시 첫 입력 상태 → 아래 목록 없음).
      if (autocompleteMode && e.target.value.trim() === "") setLastResult(null);
      onChange?.(e);
    };

    // 현재 키워드(echo)를 텍스트 그대로 검색.
    const submitEcho = () => {
      if (!trimmed) return;
      onSubmit?.(trimmed);
      closeDropdown();
    };

    // 추천·최근 검색어 모두 id 를 가진 항목이므로 같은 경로로 선택한다.
    const selectSuggestion = (s: SearchSuggestion) => {
      onSelectSuggestion?.(s);
      closeDropdown();
    };

    // 엔터(기본): 항상 목록 첫 항목으로 검색. echo 면 echo, 아니면 첫 추천.
    const commitFirst = () => {
      if (showEcho) {
        submitEcho();
        return;
      }
      const first = items[0];
      if (first) selectSuggestion(first);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!autocompleteMode) {
        onSubmit?.(query);
        return;
      }
      // 방향키로 활성화한 항목이 있으면 그 항목을 선택한다(기본 선택보다 우선).
      if (activeIndex >= 0 && activeIndex < activeLen) {
        if (showingSuggestions) {
          if (showEcho && activeIndex === 0) {
            submitEcho();
          } else {
            const s = items[showEcho ? activeIndex - 1 : activeIndex];
            if (s) selectSuggestion(s);
          }
        } else {
          const recent = recentSearches?.[activeIndex];
          if (recent) selectSuggestion(recent);
        }
        return;
      }
      // 활성 항목이 없으면 첫 항목으로.
      if (showingSuggestions) commitFirst();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (!dropdownEnabled || e.defaultPrevented) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!panelOpen) {
          setOpen(true);
          return;
        }
        if (activeLen > 0) setActiveIndex((i) => (i + 1) % activeLen);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!panelOpen) {
          setOpen(true);
          return;
        }
        // -1(없음) 또는 0 에서 위로 → 마지막 항목으로 순환.
        if (activeLen > 0) setActiveIndex((i) => (i <= 0 ? activeLen - 1 : i - 1));
      } else if (e.key === "Escape") {
        if (panelOpen) {
          e.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
        }
      }
    };

    // 활성 항목이 스크롤 영역 밖이면 보이도록 스크롤한다.
    React.useEffect(() => {
      if (activeIndex < 0) return;
      document.getElementById(`${listId}-opt-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, listId]);

    return (
      <form role="search" className={cn("relative w-full", className)} onSubmit={handleSubmit}>
        <SearchIcon
          size={18}
          aria-hidden
          className="text-muted pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2"
        />
        <Input
          ref={innerRef}
          shape="pill"
          type="text"
          inputMode="search"
          enterKeyHint="search"
          placeholder={placeholder}
          aria-label={ariaLabel ?? placeholder}
          className="pl-11"
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={(e) => {
            setOpen(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            // 드롭다운 클릭은 mousedown preventDefault 로 포커스를 유지하므로,
            // 여기로 오는 blur 는 실제로 밖으로 나간 경우다.
            setOpen(false);
            setActiveIndex(-1);
            onBlur?.(e);
          }}
          onKeyDown={handleKeyDown}
          role={dropdownEnabled ? "combobox" : undefined}
          aria-expanded={dropdownEnabled ? panelOpen : undefined}
          aria-controls={dropdownEnabled ? listId : undefined}
          aria-autocomplete={dropdownEnabled ? "list" : undefined}
          aria-activedescendant={
            dropdownEnabled && panelOpen && activeIndex >= 0
              ? `${listId}-opt-${activeIndex}`
              : undefined
          }
          {...inputProps}
        />

        {panelOpen ? (
          <div
            // 행을 클릭해도 input 포커스가 풀리지 않게 (blur → 닫힘 방지)
            onMouseDown={(e) => e.preventDefault()}
            className="border-border-soft bg-card-bg absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-2xl border shadow-[0_14px_30px_-14px_rgba(26,18,10,0.22)]"
          >
            <div className="text-muted px-[18px] pt-[13px] pb-2 text-[11px] font-bold tracking-[0.08em] uppercase">
              {showingSuggestions ? "추천 검색 결과" : "최근 검색어"}
            </div>

            <ul id={listId} role="listbox" className={cn(DROPDOWN_LIST_MAX_H, "overflow-y-auto")}>
              {/* 최근 검색어 (입력 없음) */}
              {!showingSuggestions &&
                recentSearches?.map((recent, i) => (
                  <li
                    key={recent.id}
                    id={optionId(i)}
                    role="option"
                    aria-selected={i === activeIndex}
                  >
                    <div
                      onClick={() => selectSuggestion(recent)}
                      onMouseMove={() => setActiveIndex(i)}
                      className={rowClass(i)}
                    >
                      <span className="bg-chip-bg text-muted flex size-7 shrink-0 items-center justify-center rounded-full">
                        <ClockIcon size={15} aria-hidden />
                      </span>
                      <span className="text-text min-w-0 flex-1 truncate text-sm">
                        {recent.label}
                      </span>
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-label={`최근 검색어 ${recent.label} 삭제`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveRecent?.(recent);
                        }}
                        className="text-muted hover:text-text -m-1 flex shrink-0 cursor-pointer p-1 transition-colors"
                      >
                        <CloseIcon size={15} aria-hidden />
                      </button>
                    </div>
                  </li>
                ))}

              {/* echo: 첫 행에 현재 입력 키워드 */}
              {showEcho ? (
                <li id={optionId(0)} role="option" aria-selected={0 === activeIndex}>
                  <div
                    onClick={submitEcho}
                    onMouseMove={() => setActiveIndex(0)}
                    className={rowClass(0)}
                  >
                    <SearchIcon size={15} aria-hidden className="text-muted shrink-0" />
                    <span className="text-text min-w-0 flex-1 truncate text-sm font-medium">
                      {trimmed}
                    </span>
                  </div>
                </li>
              ) : null}

              {/* 자동완성 추천 검색어. echo 면 첫 행(0) 다음(1..)부터. */}
              {showingSuggestions &&
                items.map((s, i) => {
                  const idx = showEcho ? i + 1 : i;
                  return (
                    <li
                      key={s.id}
                      id={optionId(idx)}
                      role="option"
                      aria-selected={idx === activeIndex}
                    >
                      <div
                        onClick={() => selectSuggestion(s)}
                        onMouseMove={() => setActiveIndex(idx)}
                        className={rowClass(idx)}
                      >
                        <SearchIcon size={15} aria-hidden className="text-muted shrink-0" />
                        <span className="text-text min-w-0 flex-1 truncate text-sm font-medium">
                          {highlightMatch(s.label, trimmed)}
                        </span>
                      </div>
                    </li>
                  );
                })}

              {/* 결과 없음 — 응답이 빈 목록일 때(echo 여부와 무관하게 노출). */}
              {showNoResults ? (
                <li className="px-[18px] pt-[26px] pb-[30px] text-center">
                  <p className="text-text mb-1 text-[13.5px] font-semibold">
                    {`'${trimmed}' 검색 결과가 없어요`}
                  </p>
                  <p className="text-muted text-xs">다른 칵테일 이름이나 재료로 검색해보세요</p>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </form>
    );
  },
);
SearchBar.displayName = "SearchBar";
