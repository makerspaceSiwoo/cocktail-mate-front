import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  CloseIcon,
  HeartFilledIcon,
  HeartIcon,
  SettingsIcon,
  ShareIcon,
} from "@/shared/ui/icon";

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
      options: ["primary", "secondary", "ghost", "naked"],
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
    icon: <SettingsIcon size={20} />,
    "aria-label": "설정",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton
        variant="primary"
        icon={<SettingsIcon size={20} />}
        aria-label="설정"
      />
      <IconButton
        variant="secondary"
        icon={<ShareIcon size={20} />}
        aria-label="공유"
      />
      <IconButton
        variant="ghost"
        icon={<CloseIcon size={16} />}
        aria-label="닫기"
      />
      <IconButton
        variant="naked"
        icon={<HeartIcon size={24} className="text-muted" />}
        aria-label="찜하기"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton
        size="sm"
        icon={<SettingsIcon size={16} />}
        aria-label="설정"
      />
      <IconButton
        size="md"
        icon={<SettingsIcon size={20} />}
        aria-label="설정"
      />
      <IconButton
        size="lg"
        icon={<SettingsIcon size={24} />}
        aria-label="설정"
      />
    </div>
  ),
};

// Heart toggle — click to like/unlike. naked variant strips the chip background;
// `pressedIcon` swaps to the filled heart, and we color it with --color-heart
// via Tailwind's `text-heart` token. No surrounding box.
export const Heart: Story = {
  args: {
    variant: "naked",
    icon: <HeartIcon size={24} className="text-muted" />,
    pressedIcon: <HeartFilledIcon size={24} className="text-heart" />,
    defaultPressed: false,
    "aria-label": "찜하기",
  },
};

// Pre-pressed heart (starts liked).
export const HeartPressed: Story = {
  args: {
    variant: "naked",
    icon: <HeartIcon size={24} className="text-muted" />,
    pressedIcon: <HeartFilledIcon size={24} className="text-heart" />,
    defaultPressed: true,
    "aria-label": "찜 취소",
  },
};

// Heart toggle at multiple sizes.
export const HeartSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {[16, 20, 24, 32].map((s) => (
        <IconButton
          key={s}
          variant="naked"
          icon={<HeartIcon size={s} className="text-muted" />}
          pressedIcon={<HeartFilledIcon size={s} className="text-heart" />}
          defaultPressed
          aria-label={`찜하기 ${s}`}
        />
      ))}
    </div>
  ),
};
