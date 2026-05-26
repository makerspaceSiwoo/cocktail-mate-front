import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StepIndicator } from "./step-indicator";

const meta: Meta<typeof StepIndicator> = {
  title: "shared/ui/StepIndicator",
  component: StepIndicator,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    current: { control: { type: "number", min: 0 } },
    total: { control: { type: "number", min: 1 } },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof StepIndicator>;

export const OneOfThree: Story = {
  args: { current: 1, total: 3 },
};

export const TwoOfThree: Story = {
  args: { current: 2, total: 3 },
};

export const ThreeOfThree: Story = {
  args: { current: 3, total: 3 },
};
