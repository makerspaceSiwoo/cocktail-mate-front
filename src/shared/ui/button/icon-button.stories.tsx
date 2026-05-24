import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HeartFilledIcon, HeartIcon } from "@/shared/ui/icon";

import { IconButton } from "./icon-button";

const meta: Meta<typeof IconButton> = {
  title: "shared/ui/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "ghost"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: <HeartIcon size={20} />,
    "aria-label": "좋아요",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton
        variant="primary"
        icon={<HeartIcon size={20} />}
        aria-label="좋아요"
      />
      <IconButton
        variant="secondary"
        icon={<HeartIcon size={20} />}
        aria-label="좋아요"
      />
      <IconButton
        variant="ghost"
        icon={<HeartIcon size={20} />}
        aria-label="좋아요"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton
        size="sm"
        icon={<HeartIcon size={16} />}
        aria-label="좋아요"
      />
      <IconButton
        size="md"
        icon={<HeartIcon size={20} />}
        aria-label="좋아요"
      />
      <IconButton
        size="lg"
        icon={<HeartIcon size={24} />}
        aria-label="좋아요"
      />
    </div>
  ),
};

export const Filled: Story = {
  args: {
    icon: <HeartFilledIcon size={20} />,
    "aria-label": "좋아요 취소",
  },
};
