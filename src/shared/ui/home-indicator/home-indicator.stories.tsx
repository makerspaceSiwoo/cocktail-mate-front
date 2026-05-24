import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HomeIndicator } from "./home-indicator";

const meta: Meta<typeof HomeIndicator> = {
  title: "shared/ui/HomeIndicator",
  component: HomeIndicator,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof HomeIndicator>;

export const Default: Story = {
  render: () => (
    <div className="w-[375px] mx-auto">
      <HomeIndicator />
    </div>
  ),
};
