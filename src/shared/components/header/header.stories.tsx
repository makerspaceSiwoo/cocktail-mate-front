import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Header } from "./header";

const meta: Meta<typeof Header> = {
  title: "shared/components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="bg-bg mx-auto flex min-h-screen w-full flex-col">
        <Story />
        <div className="text-muted flex-1 p-5 text-sm">페이지 콘텐츠 영역</div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};
