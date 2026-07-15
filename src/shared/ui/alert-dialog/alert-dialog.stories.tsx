import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { Button } from "@/shared/ui/button";

import { AlertDialog } from "./alert-dialog";

const meta: Meta<typeof AlertDialog> = {
  title: "shared/ui/AlertDialog",
  component: AlertDialog,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof AlertDialog>;

/** 칵테일잔 아이콘 (currentColor → accent 상속). */
function GlassIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h16l-8 9-8-9z" />
      <path d="M12 13v6" />
      <path d="M8 21h8" />
    </svg>
  );
}

/** alert — 확인 버튼만 (단순 안내/완료). */
export const Alert: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>alert 열기</Button>
        <AlertDialog
          open={open}
          onClose={() => setOpen(false)}
          variant="alert"
          icon={<GlassIcon />}
          title="저장되었어요"
          description={"마이페이지 → 좋아요 목록에서\n다시 볼 수 있어요."}
        />
      </>
    );
  },
};

/** confirm — 취소 + 확인 (파괴적/선택 확인). */
export const Confirm: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>confirm 열기</Button>
        <AlertDialog
          open={open}
          onClose={() => setOpen(false)}
          variant="confirm"
          title="로그아웃 할까요?"
          description={"다시 로그인하려면 이메일과\n비밀번호가 필요해요."}
          cancelText="취소"
          confirmText="로그아웃"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

/** 아이콘/설명 없는 최소 형태. */
export const TitleOnly: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>title-only 열기</Button>
        <AlertDialog
          open={open}
          onClose={() => setOpen(false)}
          title="로그인 후 이용 가능합니다."
        />
      </>
    );
  },
};
