import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { SearchBar, type SearchSuggestion } from "./search-bar";

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
    echo: { control: "boolean" },
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

// 최근 검색어도 id+label 항목(선택 시점의 id 를 보관해 재선택 시 id 실행 가능).
const INITIAL_RECENT: SearchSuggestion[] = [
  { id: 1, label: "모히토" },
  { id: 7, label: "마가리타" },
  { id: 8, label: "블루 하와이" },
  { id: 9, label: "위스키 사워" },
  { id: 10, label: "진 토닉" },
];

const strip = (s: string) => s.replace(/\s/g, "");
const matchSuggestions = (query: string): SearchSuggestion[] => {
  const q = strip(query.trim());
  if (!q) return [];
  return MOCK_COCKTAILS.filter((c) => strip(c.label).includes(q)).slice(0, 5);
};

/**
 * autocomplete 데모 — 컴포넌트가 디바운스로 조회를 관리한다.
 * fetchSuggestions 는 matchSuggestions 를 setTimeout(500ms) 로 감싸 API 지연을
 * 흉내낸다. 콜백은 콘솔 + 화면 하단 로그로 보여준다.
 */
function AutocompleteDemo({ echo }: { echo: boolean }) {
  const [value, setValue] = React.useState("");
  const [recent, setRecent] = React.useState<SearchSuggestion[]>(INITIAL_RECENT);
  const [log, setLog] = React.useState<string[]>([]);

  const push = (message: string) => {
    console.log("[SearchBar]", message);
    setLog((prev) => [message, ...prev].slice(0, 6));
  };

  const fetchSuggestions = (keyword: string) =>
    new Promise<SearchSuggestion[]>((resolve) => {
      window.setTimeout(() => resolve(matchSuggestions(keyword)), 500);
    });

  const remember = (item: SearchSuggestion) =>
    setRecent((prev) => [item, ...prev.filter((r) => r.id !== item.id)].slice(0, 5));

  return (
    <div className="flex flex-col gap-3">
      <SearchBar
        placeholder="칵테일 검색"
        echo={echo}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        fetchSuggestions={fetchSuggestions}
        debounceMs={400}
        recentSearches={recent}
        // echo(텍스트 검색)는 id 가 없으므로 id=키워드로 합성해 보관(데모용).
        onSubmit={(term) => {
          push(`onSubmit(text) → "${term}"`);
          remember({ id: term, label: term });
        }}
        onSelectSuggestion={(s) => {
          push(`onSelectSuggestion → #${s.id} "${s.label}"`);
          setValue(s.label);
          remember(s);
        }}
        onRemoveRecent={(recent) => {
          push(`onRemoveRecent → #${recent.id} "${recent.label}"`);
          setRecent((prev) => prev.filter((r) => r.id !== recent.id));
        }}
      />

      <div className="border-border-soft bg-card-bg mt-2 rounded-xl border p-3">
        <p className="text-muted mb-2 text-[11px] font-bold tracking-[0.08em] uppercase">
          console (echo: {String(echo)})
        </p>
        {log.length === 0 ? (
          <p className="text-muted text-xs">
            포커스 → 최근 검색어, 입력 → 자동완성(디바운스). 클릭·Enter 시 이벤트가 여기 찍힙니다.
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

// ── 순수 입력(autocomplete 미사용) ────────────────────────────

// 비어 있는 기본 상태 — 입력 전에는 clear 버튼이 없다. 드롭다운도 없다.
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

// ── autocomplete 모드 ─────────────────────────────────────────

/**
 * autocomplete + echo — 첫 행에 현재 입력값(echo)이 뜬다.
 * Enter/기본 선택 = 입력값으로 검색(onSubmit). 화살표·클릭 = 그 항목으로 검색.
 * 조회 대기 중에도 이전 결과가 유지돼 "결과 없음" 이 깜빡이지 않고, 응답이 빈
 * 목록이면 "검색 결과가 없어요" 를 노출한다.
 */
export const AutocompleteEcho: Story = {
  render: () => <AutocompleteDemo echo />,
};

/**
 * autocomplete + echo=false — 추천 목록만 뜬다.
 * Enter/기본 선택 = 첫 번째 추천으로 검색(onSelectSuggestion).
 */
export const AutocompleteNoEcho: Story = {
  render: () => <AutocompleteDemo echo={false} />,
};
