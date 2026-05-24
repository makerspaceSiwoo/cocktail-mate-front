import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StepIndicator } from "./step-indicator";

const meta: Meta<typeof StepIndicator> = {
  title: "shared/ui/StepIndicator",
  component: StepIndicator,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof StepIndicator>;

export const OneOfThree: Story = {
  render: () => (
    <div className="w-80">
      <StepIndicator current={1} total={3} />
    </div>
  ),
};

export const TwoOfThree: Story = {
  render: () => (
    <div className="w-80">
      <StepIndicator current={2} total={3} />
    </div>
  ),
};

export const ThreeOfThree: Story = {
  render: () => (
    <div className="w-80">
      <StepIndicator current={3} total={3} />
    </div>
  ),
};

export const Custom: Story = {
  render: () => (
    <div className="w-80">
      <StepIndicator current={2} total={5} />
    </div>
  ),
};
