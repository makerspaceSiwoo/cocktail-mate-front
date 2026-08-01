import { BottomNav } from "@/shared/components/bottom-nav/bottom-nav";
import { Header } from "@/shared/components/header/header";

export default function GuestWithMenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <BottomNav />
    </>
  );
}
