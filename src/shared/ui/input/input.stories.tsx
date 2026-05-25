import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

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
    clearable: { control: "boolean" },
    shape: {
      control: { type: "select" },
      options: ["rounded", "pill"],
    },
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

// Empty — no clear button until the user types.
export const Default: Story = {
  args: {
    placeholder: "검색어를 입력하세요",
  },
};

// Uncontrolled with prefilled text — clear button is visible. Clicking it
// resets the input to "".
export const WithText: Story = {
  args: {
    defaultValue: "모히토",
    placeholder: "검색어를 입력하세요",
  },
};

// Controlled — parent owns the value. Clear still works because the input
// dispatches a native input event when the X button is pressed.
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("에스프레소 마티니");
    return (
      <div className="flex flex-col gap-2">
        <Input
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue("")}
        />
        <span className="text-muted text-xs">현재 값: {`"${value}"`}</span>
      </div>
    );
  },
  args: {
    placeholder: "검색어를 입력하세요",
  },
};

// Clear button suppressed.
export const NotClearable: Story = {
  args: {
    defaultValue: "clear 없이",
    clearable: false,
  },
};

export const Pill: Story = {
  args: {
    shape: "pill",
    defaultValue: "라스트 워드",
  },
};

export const Error: Story = {
  args: {
    error: true,
    defaultValue: "잘못된 입력",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "비활성",
  },
};
