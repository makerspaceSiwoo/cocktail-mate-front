import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { type CocktailDetail as CocktailDetailModel } from "@/entities/cocktail";
import { CocktailDetail, getCocktailDetail } from "@/features/cocktail-detail";
import { getRanking } from "@/features/likes-ranking";
import { HttpError } from "@/shared/api";

/**
 * 상세는 레시피·재료 위주라 자주 바뀌지 않는다. 1시간 ISR 로 캐시해 두 번째
 * 방문부터는 서버 왕복(≈400ms) 없이 즉시 뜨게 한다.
 */
export const revalidate = 3600;

const getCocktail = cache(async (id: number) => getCocktailDetail(id));

type DetailPageProps = { params: Promise<{ id: string }> };

/**
 * 전체 602종을 빌드 시점에 다 굽지는 않는다(빌드 시간·API 부하). 진입 빈도가 높은
 * 홈 좋아요 랭킹 상단만 미리 생성하고, 나머지는 dynamicParams(기본 true) 로 첫 요청
 * 때 생성된 뒤 revalidate 주기 동안 캐시된다.
 */
export async function generateStaticParams() {
  try {
    const ranking = await getRanking(20);
    return ranking.map((cocktail) => ({ id: String(cocktail.id) }));
  } catch (error: unknown) {
    // 빌드 시 랭킹을 못 받아도 빌드를 깨뜨리지 않는다(전부 on-demand 생성으로 폴백).
    console.error("상세 프리렌더 대상 조회 실패:", error);
    return [];
  }
}

function parseCocktailId(value: string) {
  if (!/^\d+$/.test(value)) return null;

  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = parseCocktailId(rawId);

  if (!id) return { title: "칵테일을 찾을 수 없음 | CocktailMate" };

  try {
    const cocktail = await getCocktail(id);
    return {
      title: `${cocktail.name} | CocktailMate`,
      description: cocktail.description ?? `${cocktail.name}의 재료와 레시피를 확인하세요.`,
    };
  } catch {
    return { title: "칵테일 상세 | CocktailMate" };
  }
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id: rawId } = await params;
  const id = parseCocktailId(rawId);

  if (!id) notFound();

  let cocktail: CocktailDetailModel;
  try {
    cocktail = await getCocktail(id);
  } catch (error: unknown) {
    if (error instanceof HttpError && error.status === 404) notFound();
    throw error;
  }

  return <CocktailDetail cocktail={{ ...cocktail, isLiked: false }} />;
}
