"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { cocktailQueries } from "@/entities/cocktail";
import { Button } from "@/shared/ui/button";
import { Chip } from "@/shared/ui/chip";

import { groupDescriptorsByCategory } from "../lib/categories";

/** "선택 안 함" 을 나타내는 특수 값. 실제 descriptorId 와 구분한다. */
const NONE = "none" as const;

/** 카테고리별 선택 상태. 모든 카테고리가 필수(선택 안 함 포함)다. */
type Answers = Record<string, number | typeof NONE>;

/**
 * 취향 선택 폼. 모든 카테고리가 필수이며, 각 카테고리에서 1개(또는 "선택 안 함")를
 * 고른다. 미선택 상태로 제출하면 해당 카테고리 라벨 옆에 에러 메시지를 노출하고,
 * 전부 선택하면 결과 페이지로 이동한다(모두 "선택 안 함"이면 랜덤 추천).
 */
export function TasteForm() {
  const router = useRouter();
  const catalog = useQuery(cocktailQueries.tasteDescriptors());
  const [answers, setAnswers] = useState<Answers>({});
  // 제출을 시도했는지 — shadcn form 처럼 제출 후에만 미선택 에러를 노출한다.
  const [attempted, setAttempted] = useState(false);

  const groups = useMemo(
    () => (catalog.data ? groupDescriptorsByCategory(catalog.data.items) : []),
    [catalog.data],
  );

  const allAnswered = groups.length > 0 && groups.every((group) => group.category in answers);

  function select(category: string, value: number | typeof NONE) {
    setAnswers((prev) => ({ ...prev, [category]: value }));
  }

  function handleSubmit() {
    if (!allAnswered) {
      setAttempted(true);
      // 첫 미선택 카테고리로 스크롤해 어디를 채워야 하는지 바로 보여준다.
      const missing = groups.find((group) => !(group.category in answers));
      if (missing) {
        document
          .getElementById(`taste-group-${missing.category}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    const ids = Object.values(answers).filter((value): value is number => value !== NONE);
    const query = ids.length > 0 ? `?ids=${ids.join(",")}` : "";
    router.push(`/recommend/result${query}`);
  }

  if (catalog.isLoading) {
    return <p className="text-muted p-6 text-center text-sm">취향 선택지를 불러오는 중…</p>;
  }

  if (catalog.isError || groups.length === 0) {
    return (
      <p className="text-muted p-6 text-center text-sm">
        취향 선택지를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
      </p>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* 스크롤은 이 main 내부에서만 발생한다(셸은 overflow-hidden). */}
      <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">내 취향 알아보기</h1>
          <p className="text-muted text-sm break-keep">
            카테고리마다 하나씩 골라주세요. 모두 &lsquo;선택 안 함&rsquo;이면 랜덤으로 추천해드려요.
          </p>
        </header>

        {groups.map((group) => {
          const selected = answers[group.category];
          const showError = attempted && !(group.category in answers);
          return (
            <fieldset
              key={group.category}
              id={`taste-group-${group.category}`}
              aria-invalid={showError || undefined}
              aria-describedby={showError ? `taste-error-${group.category}` : undefined}
              className="flex flex-col gap-3"
            >
              <legend className="text-text mb-1 text-base font-bold">
                <span className="flex flex-wrap items-baseline gap-x-1.5">
                  <span>{group.label}</span>
                  <span className="text-heart" aria-hidden>
                    *
                  </span>
                  {showError && (
                    <span
                      id={`taste-error-${group.category}`}
                      role="alert"
                      className="text-heart text-xs font-medium"
                    >
                      추천을 받으려면 항목을 선택해야 합니다
                    </span>
                  )}
                </span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {group.descriptors.map((descriptor) => (
                  <Chip
                    key={descriptor.id}
                    label={descriptor.labelKo}
                    active={selected === descriptor.id}
                    onClick={() => select(group.category, descriptor.id)}
                  />
                ))}
                <Chip
                  label="선택 안 함"
                  active={selected === NONE}
                  onClick={() => select(group.category, NONE)}
                />
              </div>
            </fieldset>
          );
        })}
      </main>

      {/* 하단 CTA — 스크롤 영역 밖의 셸 컬럼 내부 푸터(고정 X, 레이아웃 유지). */}
      <div className="border-border-soft bg-bg shrink-0 border-t p-4">
        <Button type="button" variant="cta" size="lg" fullWidth onClick={handleSubmit}>
          추천 받기
        </Button>
      </div>
    </div>
  );
}
