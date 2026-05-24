import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ActionButton } from "./action-button";

const meta: Meta<typeof ActionButton> = {
  title: "shared/ui/ActionButton",
  component: ActionButton,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ActionButton>;

export const Like: Story = {
  args: {
    tone: "like",
    label: "좋아요",
    count: "2.3k",
    "aria-label": "좋아요 2.3k",
  },
};

export const Share: Story = {
  args: {
    tone: "share",
    label: "공유",
    "aria-label": "공유하기",
  },
};

export const LikeNoCount: Story = {
  args: {
    tone: "like",
    label: "좋아요",
    "aria-label": "좋아요",
  },
};

export const Row: Story = {
  render: () => (
    <div className="flex gap-3">
      <ActionButton
        tone="like"
        label="좋아요"
        count="2.3k"
        aria-label="좋아요 2.3k"
      />
      <ActionButton tone="share" label="공유" aria-label="공유하기" />
    </div>
  ),
};
