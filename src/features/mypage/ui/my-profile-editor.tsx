"use client";

import * as React from "react";

import { Button, IconButton } from "@/shared/ui/button";
import { CameraIcon, ChevronLeftIcon } from "@/shared/ui/icon/icons";
import { Input } from "@/shared/ui/input";

const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9]+(?:[-_][가-힣a-zA-Z0-9]+)*$/;
const NICKNAME_HELP_MESSAGE =
  "닉네임은 공백 없이 2~10자의 한글, 영문, 숫자, 하이픈(-), 밑줄(_)만 사용할 수 있어요. 하이픈과 밑줄은 처음, 끝 또는 연속해서 사용할 수 없어요.";

interface MyProfileEditorProps {
  initialNickname: string;
  isSaving?: boolean;
  errorMessage?: string;
  onBack: () => void;
  onSubmit: (nickname: string) => Promise<void>;
}

export function MyProfileEditor({
  initialNickname,
  isSaving = false,
  errorMessage,
  onBack,
  onSubmit,
}: MyProfileEditorProps) {
  const [nickname, setNickname] = React.useState(initialNickname);
  const [validationMessage, setValidationMessage] = React.useState<string | null>(null);
  const hasChanged = nickname !== initialNickname;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nickname.length < 2 || nickname.length > 10 || !NICKNAME_PATTERN.test(nickname)) {
      setValidationMessage(NICKNAME_HELP_MESSAGE);
      return;
    }
    setValidationMessage(null);
    await onSubmit(nickname);
  };

  const message = validationMessage ?? errorMessage;

  return (
    <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
      <header className="flex h-[72px] shrink-0 items-center gap-2 px-5">
        <IconButton
          type="button"
          variant="naked"
          aria-label="회원정보 화면으로 돌아가기"
          icon={<ChevronLeftIcon size={32} />}
          onClick={onBack}
          className="flex size-11 items-center justify-center"
        />
        <h1 className="text-[22px] font-bold tracking-[-0.02em]">회원정보 수정</h1>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-8 pb-6">
        <div className="bg-profile-bg text-muted relative mx-auto flex size-40 items-center justify-center rounded-full">
          <span className="text-4xl font-bold" aria-hidden="true">
            {initialNickname.charAt(0)}
          </span>
          <span className="border-bg bg-text text-card-bg absolute right-0 bottom-1 flex size-11 items-center justify-center rounded-full border-4">
            <CameraIcon size={20} aria-hidden />
          </span>
          <span className="sr-only">프로필 사진 변경은 준비 중입니다.</span>
        </div>

        <section className="mt-12" aria-labelledby="nickname-label">
          <label id="nickname-label" htmlFor="profile-nickname" className="text-lg font-bold">
            닉네임
          </label>
          <div className="mt-4">
            <Input
              id="profile-nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              onClear={() => setNickname("")}
              maxLength={10}
              autoComplete="nickname"
              clearable
              error={Boolean(message)}
              aria-describedby="profile-nickname-help"
              className="h-[64px] text-xl"
            />
          </div>
          <p
            id="profile-nickname-help"
            className={message ? "text-heart mt-3 text-sm" : "text-muted mt-3 text-sm"}
          >
            {message ?? NICKNAME_HELP_MESSAGE}
          </p>
        </section>
      </div>

      <footer className="border-border bg-card-bg shrink-0 border-t px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <Button type="submit" fullWidth size="lg" disabled={!hasChanged || isSaving}>
          {isSaving ? "저장 중..." : "저장하기"}
        </Button>
      </footer>
    </form>
  );
}
