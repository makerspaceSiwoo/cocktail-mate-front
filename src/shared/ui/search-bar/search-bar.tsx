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

/** Enter(가상 키보드 검색) 제출 동작. */
export type SearchSubmitMode =
  /** 입력한 텍스트를 그대로 검색. 추천 검색어가 없어도 검색된다. → onSubmit */
  | "text"
  /** 항상 자동완성 첫 번째 값으로 검색. 추천이 없으면 검색되지 않는다. → onSelectSuggestion */
  | "first-suggestion";

export interface SearchBarProps extends Omit<InputProps, "shape" | "onSubmit"> {
  /**
   * 텍스트 기반 검색이 실행될 때 호출된다.
   * - 최근 검색어 클릭 · '전체 검색 결과 보기' · Enter(submitMode="text")
   * - 드롭다운을 쓰지 않을 때의 기본 Enter 동작도 이 콜백을 사용한다.
   */
  onSubmit?: (value: string) => void;
  /** 바깥 form 래퍼에 적용할 클래스. (input 은 pill 로 고정) */
  className?: string;

  // ── 자동완성 드롭다운 (opt-in) ────────────────────────────────
  // recentSearches / suggestions 중 하나라도 주면 드롭다운이 활성화된다.
  // 아무것도 주지 않으면 기존 pill 입력 그대로 동작한다.
  /**
   * 최근 검색어 목록. 사용처가 localStorage 등에서 불러와 주입한다.
   * 입력이 비어 있고 포커스 상태일 때 노출된다.
   */
  recentSearches?: string[];
  /** 최근 검색어 행의 ×(삭제) 클릭 시 호출. 목록 갱신은 사용처가 담당. */
  onRemoveRecent?: (term: string) => void;
  /** 자동완성 추천 검색어. 사용처가 현재 입력값으로 조회해 주입한다. */
  suggestions?: SearchSuggestion[];
  /**
   * 추천 검색어 선택 시 호출( 행 클릭 · Enter(submitMode="first-suggestion") ).
   * id·label 을 모두 넘겨 사용처가 텍스트 검색/ id 실행을 선택하게 한다.
   */
  onSelectSuggestion?: (suggestion: SearchSuggestion) => void;
  /** Enter 제출 모드. 기본 "text". */
  submitMode?: SearchSubmitMode;
  /**
   * '{query}' 전체 검색 결과 보기 footer 노출 여부.
   * 기본값은 submitMode === "text" (정확히 하나를 골라야 하는 모드에선 숨김).
   */
  showSearchAllFooter?: boolean;
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
 * pill 형태 검색 입력 컴포넌트 (+ 선택적 자동완성 드롭다운).
 *
 * 앞쪽에 돋보기 아이콘, 입력값이 있으면 clear(×) 버튼(Input 기본 기능)을 보여준다.
 * `recentSearches`/`suggestions` 를 넘기면 포커스 시 드롭다운이 열린다:
 * 입력이 비어 있으면 최근 검색어, 입력이 있으면 자동완성 추천 검색어를 노출한다.
 * 검색 실행/데이터 로딩은 소비 측에서 콜백으로 처리한다(컴포넌트는 UI 만).
 */
export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      onSubmit,
      className,
      placeholder = "검색",
      "aria-label": ariaLabel,
      recentSearches,
      onRemoveRecent,
      suggestions,
      onSelectSuggestion,
      submitMode = "text",
      showSearchAllFooter,
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
    // 활성 항목이 있으면 Enter 시 그 항목이 submitMode 보다 우선 선택된다.
    const [activeIndex, setActiveIndex] = React.useState(-1);

    // 드롭다운 표시/최근·추천 분기를 위해 현재 입력값을 추적한다.
    // controlled(value 지정) 면 value 를, 아니면 내부 상태를 사용.
    const isControlled = value !== undefined;
    const [innerQuery, setInnerQuery] = React.useState(() => String(defaultValue ?? ""));
    const query = isControlled ? String(value ?? "") : innerQuery;
    const trimmed = query.trim();
    const showingSuggestions = trimmed.length > 0;

    const dropdownEnabled = recentSearches !== undefined || suggestions !== undefined;
    const showFooter = showSearchAllFooter ?? submitMode === "text";
    const hasRecent = (recentSearches?.length ?? 0) > 0;
    const panelOpen = dropdownEnabled && open && (showingSuggestions || hasRecent);

    // 현재 노출 중인 목록(추천/최근)의 길이 — 방향키 이동 범위.
    const activeLen = showingSuggestions
      ? (suggestions?.length ?? 0)
      : (recentSearches?.length ?? 0);

    const optionId = (i: number) => `${listId}-opt-${i}`;
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
      onChange?.(e);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!dropdownEnabled) {
        onSubmit?.(query);
        return;
      }
      // 방향키로 활성화한 항목이 있으면 그 항목을 선택한다(submitMode 보다 우선).
      if (activeIndex >= 0 && activeIndex < activeLen) {
        if (showingSuggestions) {
          const s = suggestions?.[activeIndex];
          if (s) {
            onSelectSuggestion?.(s);
            closeDropdown();
          }
        } else {
          const term = recentSearches?.[activeIndex];
          if (term !== undefined) {
            onSubmit?.(term);
            closeDropdown();
          }
        }
        return;
      }
      if (submitMode === "first-suggestion") {
        // 정확히 하나를 골라야 하는 모드 — 추천이 없으면 아무 것도 하지 않는다.
        const first = suggestions?.[0];
        if (!first) return;
        onSelectSuggestion?.(first);
      } else {
        if (!trimmed) return;
        onSubmit?.(trimmed);
      }
      closeDropdown();
    };

    const handleRecentClick = (term: string) => {
      onSubmit?.(term);
      closeDropdown();
    };

    const handleSuggestionClick = (s: SearchSuggestion) => {
      onSelectSuggestion?.(s);
      closeDropdown();
    };

    const handleSearchAll = () => {
      if (trimmed) onSubmit?.(trimmed);
      closeDropdown();
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
                recentSearches?.map((term, i) => (
                  <li key={term} id={optionId(i)} role="option" aria-selected={i === activeIndex}>
                    <div
                      onClick={() => handleRecentClick(term)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={rowClass(i)}
                    >
                      <span className="bg-chip-bg text-muted flex size-7 shrink-0 items-center justify-center rounded-full">
                        <ClockIcon size={15} aria-hidden />
                      </span>
                      <span className="text-text min-w-0 flex-1 truncate text-sm">{term}</span>
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-label={`최근 검색어 ${term} 삭제`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveRecent?.(term);
                        }}
                        className="text-muted hover:text-text -m-1 flex shrink-0 cursor-pointer p-1 transition-colors"
                      >
                        <CloseIcon size={15} aria-hidden />
                      </button>
                    </div>
                  </li>
                ))}

              {/* 자동완성 추천 검색어 (입력 있음) */}
              {showingSuggestions &&
                suggestions?.map((s, i) => (
                  <li key={s.id} id={optionId(i)} role="option" aria-selected={i === activeIndex}>
                    <div
                      onClick={() => handleSuggestionClick(s)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={rowClass(i)}
                    >
                      <SearchIcon size={15} aria-hidden className="text-muted shrink-0" />
                      <span className="text-text min-w-0 flex-1 truncate text-sm font-medium">
                        {highlightMatch(s.label, trimmed)}
                      </span>
                    </div>
                  </li>
                ))}

              {/* 결과 없음 */}
              {showingSuggestions && (suggestions?.length ?? 0) === 0 ? (
                <li className="px-[18px] pt-[26px] pb-[30px] text-center">
                  <p className="text-text mb-1 text-[13.5px] font-semibold">
                    {`'${trimmed}' 검색 결과가 없어요`}
                  </p>
                  <p className="text-muted text-xs">다른 칵테일 이름이나 재료로 검색해보세요</p>
                </li>
              ) : null}
            </ul>

            {/* footer: 전체 검색 (텍스트 그대로 검색) */}
            {showingSuggestions && showFooter && (suggestions?.length ?? 0) > 0 ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={handleSearchAll}
                className="border-border-soft text-accent hover:bg-chip-bg flex w-full cursor-pointer items-center gap-2 border-t px-[18px] py-[13px] text-[13px] font-bold transition-colors"
              >
                <SearchIcon size={15} aria-hidden className="text-accent" />
                <span className="truncate">{`'${trimmed}' 전체 검색 결과 보기`}</span>
              </button>
            ) : null}
          </div>
        ) : null}
      </form>
    );
  },
);
SearchBar.displayName = "SearchBar";
