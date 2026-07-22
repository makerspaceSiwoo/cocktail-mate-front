"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth";
import { Button } from "@/shared/ui/button";

import { MyProfile } from "./my-profile";
import { MyProfileError } from "./my-profile-error";
import { MyProfileSkeleton } from "./my-profile-skeleton";

export function MyProfileContainer() {
  const { user, isLoading, logout, refreshUser } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <MyProfileSkeleton />;
  }

  const goToSignIn = () => {
    sessionStorage.setItem("returnTo", "/my");
    router.replace("/sign-in");
  };

  if (!user) {
    return <MyProfileError unauthorized onRetry={() => void refreshUser()} onSignIn={goToSignIn} />;
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/home");
  };

  return (
    <>
      <MyProfile user={user} />
      <div className="px-[22px] py-6">
        <Button type="button" variant="secondary" size="lg" fullWidth onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </>
  );
}
