"use client";

import { usePathname } from "next/navigation";

import { BottomNav } from "@/shared/components/bottom-nav/bottom-nav";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditingProfile = pathname === "/my/edit";

  return (
    <>
      {children}
      {isEditingProfile ? null : <BottomNav />}
    </>
  );
}
