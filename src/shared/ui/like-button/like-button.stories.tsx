import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { LikeButton } from "./like-button";

const meta: Meta<typeof LikeButton> = {
  title: "shared/ui/LikeButton",
  component: LikeButton,
  args: {
    "aria-label": "찜하기",
    isLiked: false,
    size: 24,
  },
  argTypes: {
    isLiked: { control: "boolean" },
    size: { control: { type: "number", min: 12, max: 64, step: 2 } },
  },
};

export default meta;

type Story = StoryObj<typeof LikeButton>;

// Static — controlled by the toolbar arg.
export const Unliked: Story = {
  args: { isLiked: false },
};

export const Liked: Story = {
  args: { isLiked: true },
};

// Interactive — local state toggles isLiked on click. Mirrors real usage.
export const Interactive: Story = {
  render: (args) => {
    const [liked, setLiked] = React.useState(false);
    return (
      <LikeButton
        {...args}
        isLiked={liked}
        onClick={() => setLiked((prev) => !prev)}
      />
    );
  },
};

// Multiple sizes side by side.
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {[16, 20, 24, 32].map((s) => (
        <LikeButton key={s} aria-label={`찜하기 ${s}`} isLiked size={s} />
      ))}
    </div>
  ),
};

// Disabled state.
export const Disabled: Story = {
  args: { isLiked: true, disabled: true },
};
