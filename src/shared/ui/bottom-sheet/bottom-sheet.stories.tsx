import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { BottomSheet } from "./bottom-sheet";

const meta: Meta<typeof BottomSheet> = {
  title: "shared/ui/BottomSheet",
  component: BottomSheet,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof BottomSheet>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      // BottomSheet 는 가장 가까운 relative 조상 안에서 뜬다.
      <div className="bg-bg relative mx-auto flex h-[600px] w-[430px] flex-col overflow-hidden">
        <div className="flex flex-1 items-center justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-text text-card-bg rounded-xl px-5 py-2.5 font-bold"
          >
            시트 열기
          </button>
        </div>

        <BottomSheet open={open} onClose={() => setOpen(false)} ariaLabel="예시 시트">
          <h3 className="text-text text-[17px] font-black">바텀시트 예시</h3>
          <p className="text-muted mt-2 text-sm leading-5">
            핸들이나 시트를 아래로 끌어내리면 닫힙니다. 백드롭 클릭·ESC 로도 닫을 수 있어요.
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="bg-text text-card-bg mt-4 flex items-center justify-center rounded-xl py-2 font-bold"
          >
            닫기
          </button>
        </BottomSheet>
      </div>
    );
  },
};
