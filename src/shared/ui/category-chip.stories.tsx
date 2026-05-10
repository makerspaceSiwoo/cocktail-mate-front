import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CATEGORIES } from "@/entities/cocktail/fixtures";
import { CategoryChip } from "./category-chip";

const meta: Meta<typeof CategoryChip> = {
  title: "shared/CategoryChip",
  component: CategoryChip,
  parameters: {
    docs: {
      description: {
        component:
          "카테고리 필터의 pill 칩. active 상태에 따라 배경/텍스트 색이 반전. 사용처: 칵테일 목록 — 카테고리 필터.",
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
type Story = StoryObj<typeof CategoryChip>;

export const Inactive: Story = { args: { label: "보드카" } };
export const Active: Story = { args: { label: "전체", active: true } };

export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {CATEGORIES.slice(0, 6).map((c, i) => (
        <CategoryChip key={c} label={c} active={i === 0} />
      ))}
    </div>
  ),
};
