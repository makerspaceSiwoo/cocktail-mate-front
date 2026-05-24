import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { SectionHeader } from "./section-header";

const meta: Meta<typeof SectionHeader> = {
  title: "shared/ui/SectionHeader",
  component: SectionHeader,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof SectionHeader>;

export const None: Story = {
  render: () => (
    <div className="w-[375px] mx-auto">
      <SectionHeader title="추천 칵테일" />
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div className="w-[375px] mx-auto">
      <SectionHeader title="추천 칵테일" actionLabel="전체보기" onAction={fn()} />
    </div>
  ),
};
