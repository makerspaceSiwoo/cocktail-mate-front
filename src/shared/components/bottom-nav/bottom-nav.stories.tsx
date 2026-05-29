import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BottomNav } from "./bottom-nav";

const meta: Meta<typeof BottomNav> = {
  title: "shared/components/BottomNav",
  component: BottomNav,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/home" },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-bg">
        <div className="flex-1 p-6 text-sm text-muted">화면 컨텐츠 영역</div>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof BottomNav>;

export const HomeActive: Story = {
  parameters: { nextjs: { navigation: { pathname: "/home" } } },
};

export const ExploreActive: Story = {
  parameters: { nextjs: { navigation: { pathname: "/explore" } } },
};

export const ListActive: Story = {
  parameters: { nextjs: { navigation: { pathname: "/list" } } },
};

export const MyActive: Story = {
  parameters: { nextjs: { navigation: { pathname: "/my" } } },
};
