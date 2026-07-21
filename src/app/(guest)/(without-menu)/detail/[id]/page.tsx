import type { Metadata } from "next";
import { notFound } from "next/navigation";
import axios from "axios";
import { cache } from "react";

import { cocktailApis } from "@/entities/cocktail";
import { CocktailDetail } from "@/features/cocktail-detail";

const getCocktail = cache((id: number) => cocktailApis.getDetail(id));

async function getCocktailOrNotFound(id: number) {
  try {
    return await getCocktail(id);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cocktailId = Number(id);

  if (!Number.isInteger(cocktailId) || cocktailId < 1) {
    return { title: "칵테일 상세 | CocktailMate" };
  }

  try {
    const cocktail = await getCocktail(cocktailId);
    return {
      title: `${cocktail.name} | CocktailMate`,
      description: cocktail.description ?? `${cocktail.name} 레시피를 확인합니다.`,
    };
  } catch {
    return { title: "칵테일 상세 | CocktailMate" };
  }
}

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cocktailId = Number(id);

  if (!Number.isInteger(cocktailId) || cocktailId < 1) notFound();

  const cocktail = await getCocktailOrNotFound(cocktailId);
  return <CocktailDetail cocktail={cocktail} />;
}
