import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { Button } from "@/shared/ui/button";

import { Dialog, DialogProvider, useDialog, type AsyncDialogComponent } from "./dialog";

const meta: Meta<typeof Dialog> = {
  title: "shared/ui/Dialog",
  component: Dialog,
  parameters: { layout: "centered" },
  // Wrap every story in DialogProvider so useDialog works inside render fns.
  decorators: [
    (Story) => (
      <DialogProvider>
        <Story />
      </DialogProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Dialog>;

// CENTER — direct controlled usage (no react-dialog-async).
export const Center: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>중앙 다이얼로그 열기</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="삭제하시겠습니까?"
          description="이 작업은 되돌릴 수 없습니다."
        >
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button variant="cta" onClick={() => setOpen(false)}>
              삭제
            </Button>
          </div>
        </Dialog>
      </div>
    );
  },
};

// CENTER via react-dialog-async — returns a promise resolving to a value
// the caller can await. This is the recommended pattern.
const ConfirmDialog: AsyncDialogComponent<{ message: string }, boolean> = ({
  isOpen,
  handleClose,
  data,
}) => (
  <Dialog open={isOpen} onClose={() => handleClose(false)} title="확인" description={data.message}>
    <div className="mt-2 flex justify-end gap-2">
      <Button variant="ghost" onClick={() => handleClose(false)}>
        취소
      </Button>
      <Button variant="cta" onClick={() => handleClose(true)}>
        확인
      </Button>
    </div>
  </Dialog>
);

export const AsyncCenter: Story = {
  render: () => {
    const dialog = useDialog(ConfirmDialog);
    const [last, setLast] = React.useState<boolean | undefined>(undefined);

    return (
      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={async () => {
            const result = await dialog.open({ message: "정말 삭제할까요?" });
            setLast(result);
          }}
        >
          async dialog 열기
        </Button>
        <span className="text-muted text-xs">
          마지막 결과: {last === undefined ? "(아직 없음)" : last ? "true" : "false"}
        </span>
      </div>
    );
  },
};
