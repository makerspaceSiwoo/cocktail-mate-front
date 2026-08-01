import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ErrorView } from "./error-view";

const meta: Meta<typeof ErrorView> = {
  title: "shared/ui/ErrorView",
  component: ErrorView,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    code: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorView>;

export const NotFound: Story = {
  args: {
    code: "404",
    title: "페이지를 찾을 수 없어요",
    description: "요청하신 페이지가 없거나 주소가 변경되었어요.",
  },
};

export const ServerError: Story = {
  args: {
    code: "500",
    title: "문제가 발생했어요",
    description: "잠시 후 다시 시도해 주세요. 계속되면 잠시 뒤 다시 방문해 주세요.",
  },
};
