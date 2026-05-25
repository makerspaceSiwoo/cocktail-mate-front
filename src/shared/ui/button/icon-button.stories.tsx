import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CloseIcon, SettingsIcon, ShareIcon } from "@/shared/ui/icon";

import { IconButton } from "./icon-button";

// IconButton = action button (hover/click). For stateful toggles like the
// favorite heart, use the dedicated `LikeButton` component instead.

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
    rotate: { control: "boolean" },
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

// Hover or tap to rotate the icon 180°. Designed for the Settings cog.
export const RotateSettings: Story = {
  args: {
    icon: <SettingsIcon size={20} />,
    "aria-label": "설정",
    rotate: true,
    variant: "ghost",
  },
};

export const Disabled: Story = {
  args: {
    icon: <SettingsIcon size={20} />,
    "aria-label": "설정",
    disabled: true,
  },
};
