import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { BottomNav, type BottomNavVariant } from "./bottom-nav";

function InteractiveBottomNav({ variant }: { variant: BottomNavVariant }) {
  const [active, setActive] = useState("/");
  return <BottomNav variant={variant} activeHref={active} onSelect={setActive} />;
}

const meta: Meta<typeof BottomNav> = {
  title: "shared/components/BottomNav",
  component: BottomNav,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="bg-bg mx-auto flex min-h-screen w-full flex-col">
        <div className="text-muted flex-1 p-6 text-sm">탭을 클릭하면 active 상태가 변경됩니다.</div>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof BottomNav>;

export const Default: Story = {
  render: () => <InteractiveBottomNav variant="default" />,
};

export const Pill: Story = {
  render: () => <InteractiveBottomNav variant="pill" />,
};
