import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { Button } from "@/shared/ui/button";

import {
  Dialog,
  DialogProvider,
  useDialog,
  type AsyncDialogComponent,
} from "./dialog";

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
          position="center"
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

// BOTTOM — direct controlled usage.
export const Bottom: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>바텀시트 열기</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          position="bottom"
          title="코스모폴리탄"
          description="상큼한 라임과 크랜베리의 조화"
        >
          <div className="mt-2 flex h-12 items-center justify-center rounded-xl bg-text text-bg font-semibold">
            레시피 보기
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
  <Dialog
    open={isOpen}
    onClose={() => handleClose(false)}
    position="center"
    title="확인"
    description={data.message}
  >
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
        <span className="text-xs text-muted">
          마지막 결과:{" "}
          {last === undefined ? "(아직 없음)" : last ? "true" : "false"}
        </span>
      </div>
    );
  },
};

// BOTTOM via react-dialog-async — the manager guarantees a single instance
// of this dialog at a time, so consecutive shows replace instead of stack.
const RecipeSheet: AsyncDialogComponent<{ name: string }, void> = ({
  isOpen,
  handleClose,
  data,
}) => (
  <Dialog
    open={isOpen}
    onClose={() => handleClose()}
    position="bottom"
    title={data.name}
    description="상큼한 라임과 크랜베리의 조화"
  >
    <div
      className="mt-2 flex h-12 items-center justify-center rounded-xl bg-text text-bg font-semibold cursor-pointer"
      onClick={() => handleClose()}
    >
      레시피 보기
    </div>
  </Dialog>
);

export const AsyncBottom: Story = {
  render: () => {
    const sheet = useDialog(RecipeSheet);
    return (
      <Button onClick={() => sheet.open({ name: "코스모폴리탄" })}>
        바텀시트 (async) 열기
      </Button>
    );
  },
};
