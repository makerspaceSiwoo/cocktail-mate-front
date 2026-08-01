import type { Metadata } from "next";

import { cocktailApis, type CocktailListResponse } from "@/entities/cocktail";
import { CocktailList } from "@/features/cocktail-list";

export const metadata: Metadata = {
  title: "칵테일 목록 | CocktailMate",
  description: "베이스별 칵테일 레시피를 탐색합니다.",
};

export default async function ListPage() {
  // 전체(base=null) 첫 페이지를 서버에서 익명으로 프리페치한다.
  // isLiked 는 익명이라 false 로 오고, 로그인 사용자는 클라이언트에서 authed 재요청으로 보정한다.
  let initialFirstPage: CocktailListResponse | undefined;
  try {
    initialFirstPage = await cocktailApis.getListPage(1, 10, null);
  } catch {
    // 서버 프리페치 실패 시 클라이언트 CSR 로 폴백한다.
    initialFirstPage = undefined;
  }

  return <CocktailList initialFirstPage={initialFirstPage} />;
}
