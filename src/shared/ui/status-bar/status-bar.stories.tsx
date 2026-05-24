import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StatusBar } from "./status-bar";

const meta: Meta<typeof StatusBar> = {
  title: "shared/ui/StatusBar",
  component: StatusBar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof StatusBar>;

export const Default: Story = {
  render: () => (
    <div className="w-[375px] mx-auto">
      <StatusBar />
    </div>
  ),
};

export const CustomTime: Story = {
  render: () => (
    <div className="w-[375px] mx-auto">
      <StatusBar time="12:34" />
    </div>
  ),
};
