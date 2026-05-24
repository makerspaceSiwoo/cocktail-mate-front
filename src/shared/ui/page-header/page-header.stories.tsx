import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { PageHeader } from "./page-header";

const meta: Meta<typeof PageHeader> = {
  title: "shared/ui/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof PageHeader>;

export const Icons2: Story = {
  render: () => (
    <div className="w-[375px] mx-auto">
      <PageHeader
        actions={[
          { icon: "Bell", "aria-label": "알림", onClick: fn() },
          { icon: "Search", "aria-label": "검색", onClick: fn() },
        ]}
      />
    </div>
  ),
};

export const Icon1: Story = {
  render: () => (
    <div className="w-[375px] mx-auto">
      <PageHeader
        actions={[{ icon: "Bell", "aria-label": "알림", onClick: fn() }]}
      />
    </div>
  ),
};

export const NoActions: Story = {
  render: () => (
    <div className="w-[375px] mx-auto">
      <PageHeader />
    </div>
  ),
};
