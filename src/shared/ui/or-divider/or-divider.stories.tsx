import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OrDivider } from "./or-divider";

const meta: Meta<typeof OrDivider> = {
  title: "shared/ui/OrDivider",
  component: OrDivider,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof OrDivider>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <OrDivider />
    </div>
  ),
};

export const CustomLabel: Story = {
  render: () => (
    <div className="w-80">
      <OrDivider label="또는" />
    </div>
  ),
};
