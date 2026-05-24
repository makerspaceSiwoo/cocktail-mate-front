import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { RecentSearchChip } from "./recent-search-chip";

const meta: Meta<typeof RecentSearchChip> = {
  title: "shared/ui/RecentSearchChip",
  component: RecentSearchChip,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof RecentSearchChip>;

export const Default: Story = {
  args: { label: "모히토" },
};

export const WithOnRemove: Story = {
  args: { label: "모히토", onRemove: fn() },
};

export const Group: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-80">
      <RecentSearchChip label="모히토" onRemove={() => undefined} />
      <RecentSearchChip label="마가리타" onRemove={() => undefined} />
      <RecentSearchChip label="코스모폴리탄" onRemove={() => undefined} />
    </div>
  ),
};
