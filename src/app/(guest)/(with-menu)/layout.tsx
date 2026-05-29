import { BottomNav } from "@/shared/components/bottom-nav/bottom-nav";

export default function GuestWithMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
