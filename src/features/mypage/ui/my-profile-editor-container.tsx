"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth";
import { HttpError, updateMyInfo } from "@/shared/api";

import { MyProfileEditor } from "./my-profile-editor";

export function MyProfileEditorContainer() {
  const { user, isLoading, updateUser } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/sign-in");
  }, [isLoading, router, user]);

  if (isLoading)
    return <div className="flex flex-1" role="status" aria-label="회원정보를 불러오는 중" />;
  if (!user) return null;

  const handleSubmit = async (nickname: string) => {
    setIsSaving(true);
    setErrorMessage(undefined);
    try {
      const updatedUser = await updateMyInfo({ nickname });
      updateUser(updatedUser);
      router.replace("/my");
    } catch (error) {
      setErrorMessage(
        error instanceof HttpError ? error.message : "저장에 실패했어요. 다시 시도해주세요.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MyProfileEditor
      initialNickname={user.nickname}
      isSaving={isSaving}
      errorMessage={errorMessage}
      onBack={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}
