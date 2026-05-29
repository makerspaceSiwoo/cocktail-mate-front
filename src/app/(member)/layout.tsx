import { AppBottomNav } from "@/shared/components/bottom-nav/app-bottom-nav";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AppBottomNav />
    </>
  );
}
