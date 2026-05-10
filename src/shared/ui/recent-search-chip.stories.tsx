import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RECENT_SEARCHES } from "@/entities/cocktail/fixtures";
import { RecentSearchChip } from "./recent-search-chip";

const meta: Meta<typeof RecentSearchChip> = {
  title: "shared/RecentSearchChip",
  component: RecentSearchChip,
  parameters: {
    docs: {
      description: {
        component:
          "최근 검색어 칩. outlined 스타일에 우측 × 닫기 버튼. 사용처: 검색 홈 — 최근 검색어.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background" style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RecentSearchChip>;

export const Single: Story = { args: { label: "모히토" } };

export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, width: 360 }}>
      {RECENT_SEARCHES.slice(0, 5).map((r) => (
        <RecentSearchChip key={r} label={r} />
      ))}
    </div>
  ),
};
