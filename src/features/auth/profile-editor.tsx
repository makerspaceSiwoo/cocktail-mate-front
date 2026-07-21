"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { User } from "@/entities/user";
import { HttpError, updateMyInfo } from "@/shared/api";
import { Avatar } from "@/shared/ui/avatar";
import { Button, IconButton } from "@/shared/ui/button";
import { CameraIcon, ChevronLeftIcon } from "@/shared/ui/icon/icons";
import { Input } from "@/shared/ui/input";

import { useAuth } from "./auth-context";

const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9]+(?:[-_][가-힣a-zA-Z0-9]+)*$/;
const NICKNAME_HELP_MESSAGE =
  "닉네임은 공백 없이 2~10자의 한글, 영문, 숫자, 하이픈(-), 밑줄(_)만 사용할 수 있어요. 하이픈과 밑줄은 처음, 끝 또는 연속해서 사용할 수 없어요.";

export function ProfileEditor() {
  const { user, isLoading, updateUser } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) router.replace("/sign-in");
  }, [isLoading, router, user]);

  if (isLoading || !user)
    return <div className="flex flex-1" role="status" aria-label="회원정보를 불러오는 중" />;

  return (
    <ProfileEditorForm
      key={user.nickname}
      user={user}
      onBack={() => router.back()}
      onSaved={(updatedUser) => {
        updateUser(updatedUser);
        router.replace("/my");
      }}
    />
  );
}

interface ProfileEditorFormProps {
  user: User;
  onBack: () => void;
  onSaved: (user: User) => void;
}

function ProfileEditorForm({ user, onBack, onSaved }: ProfileEditorFormProps) {
  const [nickname, setNickname] = React.useState(user.nickname);
  const [validationMessage, setValidationMessage] = React.useState<string>();
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [isSaving, setIsSaving] = React.useState(false);

  const message = validationMessage ?? errorMessage;
  const hasChanged = nickname !== user.nickname;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (nickname.length < 2 || nickname.length > 10 || !NICKNAME_PATTERN.test(nickname)) {
      setValidationMessage(NICKNAME_HELP_MESSAGE);
      return;
    }

    setValidationMessage(undefined);
    setErrorMessage(undefined);
    setIsSaving(true);

    try {
      const updatedUser = await updateMyInfo({ nickname });
      onSaved(updatedUser);
    } catch (error) {
      setErrorMessage(
        error instanceof HttpError ? error.message : "저장에 실패했어요. 다시 시도해주세요.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
      <header className="flex h-[72px] shrink-0 items-center gap-2 px-5">
        <IconButton
          type="button"
          variant="naked"
          aria-label="회원정보 화면으로 돌아가기"
          icon={<ChevronLeftIcon size={28} />}
          onClick={onBack}
          className="flex size-11 items-center justify-center"
        />
        <h1 className="text-[22px] font-bold tracking-[-0.02em]">회원정보 수정</h1>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-8 pb-6">
        <div className="relative mx-auto">
          <Avatar
            src={user.profile_image_url ?? undefined}
            alt={`${user.nickname} 프로필 이미지`}
            size="md"
            className="size-40"
            fallbackColor="var(--color-profile-bg)"
            fallback={
              <span className="text-muted text-4xl font-bold" aria-hidden="true">
                {getInitial(user.nickname)}
              </span>
            }
          />
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

function getInitial(nickname: string): string {
  return nickname.trim().charAt(0).toUpperCase() || "C";
}
