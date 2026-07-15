import type { Metadata } from "next";

import { MyProfile } from "@/features/auth/my-profile";

export const metadata: Metadata = {
  title: "마이페이지 | Cocktail Mate",
};

export default function MyPage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <MyProfile />
    </main>
  );
}
