import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CloseIcon, SettingsIcon, ShareIcon } from "@/shared/ui/icon";

import { IconButton } from "./icon-button";

// NOTE: Heart-style "like" buttons should NOT use IconButton (which renders a
// square chip background). Use `shared/ui/heart-button` for the toggle pattern.
// IconButton is the right primitive for actions like settings, share, close.

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
