import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MyProfileEditor } from "./my-profile-editor";

const meta: Meta<typeof MyProfileEditor> = {
  title: "features/mypage/MyProfileEditor",
  component: MyProfileEditor,
  decorators: [
    (Story) => (
      <div className="bg-bg flex h-[932px] w-full max-w-[430px] overflow-hidden">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof MyProfileEditor>;

export const Default: Story = {
  args: {
    initialNickname: "칵테일 러버",
    onBack: () => undefined,
    onSubmit: async () => undefined,
  },
};

export const Saving: Story = {
  args: { ...Default.args, isSaving: true },
};

export const SaveError: Story = {
  args: { ...Default.args, errorMessage: "이미 사용 중인 닉네임이에요." },
};
