import Link from "next/link";

import { SearchIcon } from "@/shared/ui/icon/icons";

/**
 * `(with-menu)` 그룹(/, /explore, /list)의 공통 상단 헤더.
 *
 * 워드마크(→ 홈) + 검색 아이콘(→ /search) 으로만 구성한다.
 */
export function Header() {
  return (
    <header className="bg-bg sticky top-0 z-10 flex w-full shrink-0 items-center justify-between px-5 py-3">
      <Link href="/" className="text-text font-serif text-2xl font-bold tracking-tight">
        CocktailMate
      </Link>
      <Link
        href="/search"
        aria-label="검색"
        className="text-text -mr-2 flex size-11 items-center justify-center"
      >
        <SearchIcon size={24} aria-hidden="true" />
      </Link>
    </header>
  );
}
