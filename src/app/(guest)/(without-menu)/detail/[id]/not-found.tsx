import Link from "next/link";

export default function DetailNotFound() {
  return (
    <main className="bg-bg mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold">칵테일을 찾을 수 없어요</h1>
      <p className="text-muted mt-3 text-sm">삭제되었거나 잘못된 칵테일 주소입니다.</p>
      <Link href="/list" className="bg-text text-bg mt-8 rounded-full px-6 py-3 text-sm font-bold">
        목록으로 돌아가기
      </Link>
    </main>
  );
}
