import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HeartFilledIcon } from "@/shared/ui/icon";

import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "shared/ui/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "accent", "outline"],
    },
    children: { control: "text" },
  },
  args: {
    children: "Badge",
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: "NEW" },
};

export const Accent: Story = {
  args: { variant: "accent", children: "추천" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "진" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge>default</Badge>
      <Badge variant="accent">accent</Badge>
      <Badge variant="outline">outline</Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Badge>
      <HeartFilledIcon size={12} />
      좋아요 12
    </Badge>
  ),
};
