import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "shared/ui/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const SquareUnchecked: Story = {
  args: {
    shape: "square",
  },
};

export const SquareChecked: Story = {
  args: {
    shape: "square",
    defaultChecked: true,
  },
};

export const RoundUnchecked: Story = {
  args: {
    shape: "round",
  },
};

export const RoundChecked: Story = {
  args: {
    shape: "round",
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <label className="flex items-center gap-2 text-sm text-text">
      <Checkbox shape="square" defaultChecked />
      자동 로그인
    </label>
  ),
};

export const Disabled: Story = {
  args: {
    shape: "square",
    defaultChecked: true,
    disabled: true,
  },
};
