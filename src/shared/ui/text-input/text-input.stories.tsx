import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TextInput } from "./text-input";

const meta: Meta<typeof TextInput> = {
  title: "shared/ui/TextInput",
  component: TextInput,
  parameters: {
    layout: "centered",
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

type Story = StoryObj<typeof TextInput>;

export const Empty: Story = {
  args: {
    placeholder: "이메일을 입력해주세요",
  },
};

export const Filled: Story = {
  args: {
    defaultValue: "hello@cocktailmate.app",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "이메일",
    defaultValue: "user@example.com",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "비밀번호",
    defaultValue: "super-secret",
  },
};

export const Error: Story = {
  args: {
    placeholder: "이메일",
    defaultValue: "잘못된 값",
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "비활성",
    defaultValue: "수정 불가",
    disabled: true,
  },
};
