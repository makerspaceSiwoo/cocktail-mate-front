import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SocialButton } from "./social-button";

const meta: Meta<typeof SocialButton> = {
  title: "shared/ui/SocialButton",
  component: SocialButton,
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

type Story = StoryObj<typeof SocialButton>;

export const Kakao: Story = {
  args: { brand: "kakao" },
};

export const Apple: Story = {
  args: { brand: "apple" },
};

export const Google: Story = {
  args: { brand: "google" },
};

export const All: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <SocialButton brand="kakao" />
      <SocialButton brand="apple" />
      <SocialButton brand="google" />
    </div>
  ),
};
