import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { cocktailApis, type CocktailDetail as CocktailDetailModel } from "@/entities/cocktail";
import { CocktailDetail } from "@/features/cocktail-detail";

const getCocktail = cache(async (id: number) => cocktailApis.getDetail(id));

type DetailPageProps = { params: Promise<{ id: string }> };

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
    if (typeof error === "object" && error !== null && "response" in error) {
      const response = (error as { response?: { status?: number } }).response;
      if (response?.status === 404) notFound();
    }
    throw error;
  }

  return <CocktailDetail cocktail={{ ...cocktail, isLiked: false }} />;
}
