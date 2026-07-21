import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { SearchBar, type SearchSubmitMode, type SearchSuggestion } from "./search-bar";

const meta: Meta<typeof SearchBar> = {
  title: "shared/ui/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    clearable: { control: "boolean" },
    submitMode: {
      control: "inline-radio",
      options: ["text", "first-suggestion"],
    },
  },
  decorators: [
    (Story) => (
      // iPhone 14 Pro Max 기준 폭 + 드롭다운이 아래로 펼쳐질 세로 여유
      <div className="min-h-[560px] w-[430px] max-w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

// ─────────────────────────────────────────────────────────────
// Mock 데이터 — 실제 검색 API 대신 스토리에서만 사용.
// 6개 → 최근 검색어(5개 노출 후 스크롤) 데모용.
// ─────────────────────────────────────────────────────────────
const MOCK_COCKTAILS: SearchSuggestion[] = [
  { id: 1, label: "모히토" },
  { id: 2, label: "코스모폴리탄" },
  { id: 3, label: "버진 모히토" },
  { id: 4, label: "클래식 모히토" },
  { id: 5, label: "베리 모히토" },
  { id: 6, label: "망고 모히토" },
  { id: 7, label: "마가리타" },
  { id: 8, label: "블루 하와이" },
  { id: 9, label: "위스키 사워" },
  { id: 10, label: "진 토닉" },
  { id: 11, label: "네그로니" },
  { id: 12, label: "올드 패션드" },
];

const INITIAL_RECENT = ["모히토", "마가리타", "블루 하와이", "위스키 사워", "진 토닉", "네그로니"];

const strip = (s: string) => s.replace(/\s/g, "");
const matchSuggestions = (query: string): SearchSuggestion[] => {
  const q = strip(query.trim());
  if (!q) return [];
  return MOCK_COCKTAILS.filter((c) => strip(c.label).includes(q)).slice(0, 8);
};

/**
 * 검색 API 를 붙일 수 없으므로, 콜백은 콘솔에 출력하고 화면 하단에도 로그로 보여준다.
 * (실제 연결은 사용처에서: recentSearches=localStorage, suggestions=자동완성 API)
 */
function SearchBarDemo({
  submitMode,
  placeholder = "검색어를 입력해주세요",
}: {
  submitMode: SearchSubmitMode;
  placeholder?: string;
}) {
  const [value, setValue] = React.useState("");
  const [recent, setRecent] = React.useState<string[]>(INITIAL_RECENT);
  const [log, setLog] = React.useState<string[]>([]);

  const push = (message: string) => {
    console.log("[SearchBar]", message);
    setLog((prev) => [message, ...prev].slice(0, 6));
  };

  const suggestions = matchSuggestions(value);

  return (
    <div className="flex flex-col gap-3">
      <SearchBar
        placeholder={placeholder}
        submitMode={submitMode}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        recentSearches={recent}
        suggestions={suggestions}
        onSubmit={(term) => push(`onSubmit(text) → "${term}"`)}
        onSelectSuggestion={(s) => {
          push(`onSelectSuggestion → #${s.id} "${s.label}"`);
          setValue(s.label);
        }}
        onRemoveRecent={(term) => {
          push(`onRemoveRecent → "${term}"`);
          setRecent((prev) => prev.filter((t) => t !== term));
        }}
      />

      <div className="border-border-soft bg-card-bg mt-2 rounded-xl border p-3">
        <p className="text-muted mb-2 text-[11px] font-bold tracking-[0.08em] uppercase">
          console (submitMode: {submitMode})
        </p>
        {log.length === 0 ? (
          <p className="text-muted text-xs">
            포커스 → 최근 검색어, 입력 → 자동완성. 클릭·Enter 시 이벤트가 여기 찍힙니다.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {log.map((line, i) => (
              <li key={`${line}-${i}`} className="text-text font-mono text-xs">
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ── 순수 입력(드롭다운 미사용) — 기존 동작 그대로 ──────────────

// 비어 있는 기본 상태 — 입력 전에는 clear 버튼이 없다.
export const Default: Story = {
  args: {
    placeholder: "칵테일 검색",
  },
};

// 값이 채워진 상태 — clear(×) 버튼이 보인다.
export const WithText: Story = {
  args: {
    defaultValue: "모히토",
    placeholder: "칵테일 검색",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "비활성",
  },
};

// ── 자동완성 드롭다운 ─────────────────────────────────────────

/**
 * text 모드 — 입력 텍스트 그대로 검색.
 * 포커스하면 최근 검색어, 입력하면 자동완성 + '전체 검색 결과 보기' footer.
 * Enter 는 추천이 없어도 입력값으로 검색된다.
 */
export const Autocomplete: Story = {
  render: () => <SearchBarDemo submitMode="text" />,
};

/**
 * first-suggestion 모드 — Enter 시 항상 자동완성 첫 번째 값으로 검색.
 * 추천 검색어가 없으면 Enter 를 눌러도 검색되지 않는다. footer 도 숨겨진다.
 */
export const FirstSuggestionMode: Story = {
  render: () => <SearchBarDemo submitMode="first-suggestion" />,
};
