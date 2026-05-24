import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Icon, ICON_NAMES, type IconName } from "./icon";

const meta: Meta<typeof Icon> = {
  title: "shared/ui/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    name: {
      control: { type: "select" },
      options: ICON_NAMES as unknown as IconName[],
    },
    size: {
      control: { type: "number", min: 12, max: 64, step: 2 },
    },
    className: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const AllIcons: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="text-text grid grid-cols-4 gap-4 sm:grid-cols-6">
      {ICON_NAMES.map((name) => (
        <div
          key={name}
          className="bg-card-bg border-border text-text flex flex-col items-center gap-2 rounded-lg border p-3"
        >
          <Icon name={name} size={24} />
          <span className="text-muted text-center text-[11px] leading-tight break-all">
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const Single: Story = {
  args: {
    name: "Heart",
    size: 24,
  },
  render: (args) => (
    <div className="text-text inline-flex">
      <Icon {...args} />
    </div>
  ),
};
