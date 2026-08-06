import { type CocktailListResponse } from "@/entities/cocktail";

import { getCocktailListFirstPage } from "../api";
import { CocktailList } from "./cocktail-list";

/**
 * 목록 첫 페이지를 서버에서 받아 CocktailList 에 시드하는 async 서버 컴포넌트.
 *
 * page.tsx 가 아니라 이 컴포넌트가 await 를 들고 있어야 <Suspense> 로 감쌀 수 있고,
 * 그래야 데이터를 기다리는 동안 셸(헤더·바텀네비)이 먼저 스트리밍된다.
 *
 * isLiked 는 익명이라 false 로 오고, 로그인 사용자는 CocktailList 가 클라이언트에서
 * authed 재요청으로 보정한다.
 */
export async function CocktailListSection() {
  let initialFirstPage: CocktailListResponse | undefined;
  try {
    initialFirstPage = await getCocktailListFirstPage();
  } catch {
    // 서버 프리페치 실패 시 클라이언트 CSR 로 폴백한다.
    initialFirstPage = undefined;
  }

  return <CocktailList initialFirstPage={initialFirstPage} />;
}
