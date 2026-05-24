import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CategoryChip } from "./category-chip";

const meta: Meta<typeof CategoryChip> = {
  title: "shared/ui/CategoryChip",
  component: CategoryChip,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "전체",
  },
};

export default meta;

type Story = StoryObj<typeof CategoryChip>;

export const Active: Story = {
  args: { active: true },
};

export const Inactive: Story = {
  args: { active: false },
};

export const Group: Story = {
  render: () => (
    <div className="flex gap-2">
      <CategoryChip active>전체</CategoryChip>
      <CategoryChip>진</CategoryChip>
      <CategoryChip>럼</CategoryChip>
      <CategoryChip>위스키</CategoryChip>
      <CategoryChip>보드카</CategoryChip>
    </div>
  ),
};
