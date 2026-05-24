import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CloseIcon, SearchIcon } from "@/shared/ui/icon";

import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "shared/ui/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    shape: {
      control: { type: "select" },
      options: ["rounded", "pill"],
    },
    value: { control: "text" },
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

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "검색어를 입력하세요",
  },
};

export const WithLeftIcon: Story = {
  args: {
    placeholder: "칵테일 검색",
    leftIcon: <SearchIcon size={18} />,
  },
};

export const WithRightIcon: Story = {
  args: {
    defaultValue: "모히토",
    rightIcon: <CloseIcon size={16} />,
  },
};

export const WithBothIcons: Story = {
  args: {
    defaultValue: "에스프레소 마티니",
    leftIcon: <SearchIcon size={18} />,
    rightIcon: <CloseIcon size={16} />,
  },
};

export const Pill: Story = {
  args: {
    shape: "pill",
    placeholder: "칵테일 검색",
    leftIcon: <SearchIcon size={18} />,
  },
};

export const Error: Story = {
  args: {
    error: true,
    placeholder: "잘못된 입력",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "검색어를 입력하세요",
  },
};
