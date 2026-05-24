import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HeartButton } from "./heart-button";

const meta: Meta<typeof HeartButton> = {
  title: "shared/ui/HeartButton",
  component: HeartButton,
  args: {
    "aria-label": "찜하기",
  },
  argTypes: {
    size: { control: { type: "number", min: 12, max: 64, step: 2 } },
    pressed: { control: "boolean" },
    defaultPressed: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof HeartButton>;

// Uncontrolled — click to toggle. No surrounding box; the inner heart fills
// with the design-token pink (--color-heart) when pressed.
export const Default: Story = {
  args: {
    defaultPressed: false,
    size: 24,
  },
};

// Pre-pressed (filled pink).
export const Pressed: Story = {
  args: {
    defaultPressed: true,
    size: 24,
  },
};

// Multiple sizes side by side.
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-6">
      <HeartButton {...args} aria-label="찜하기 16" size={16} />
      <HeartButton {...args} aria-label="찜하기 20" size={20} />
      <HeartButton {...args} aria-label="찜하기 24" size={24} />
      <HeartButton {...args} aria-label="찜하기 32" size={32} />
    </div>
  ),
  args: {
    defaultPressed: true,
  },
};

// Controlled — parent owns pressed state.
export const Controlled: Story = {
  args: {
    pressed: true,
  },
};

// Disabled state.
export const Disabled: Story = {
  args: {
    defaultPressed: true,
    disabled: true,
  },
};
