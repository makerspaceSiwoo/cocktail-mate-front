import type { TasteDescriptor } from "@/entities/cocktail";

/** 폼에 노출할 카테고리 순서. 백엔드 category 코드 기준. */
export const TASTE_CATEGORY_ORDER = [
  // 기본 맛(단·짠·신·쓴 등)이 가장 직관적이라 맨 앞에 둔다. 백엔드 축 순서(0~7)와도 같다.
  "taste_chemosensory",
  "fruit",
  "aroma",
  "mouthfeel",
  "finish",
  "body",
  "temperature",
  "alcohol",
] as const;

/** 카테고리 코드 → 화면 제목. 알 수 없는 코드는 코드 그대로 노출한다. */
export const TASTE_CATEGORY_LABELS: Record<string, string> = {
  taste_chemosensory: "기본 맛",
  fruit: "과일",
  aroma: "향 (아로마)",
  mouthfeel: "질감",
  finish: "여운 (피니시)",
  body: "바디",
  temperature: "온도",
  alcohol: "알코올감",
};

export interface TasteCategoryGroup {
  category: string;
  label: string;
  descriptors: TasteDescriptor[];
}

/**
 * 취향 선택지를 카테고리별로 묶는다. 카테고리는 {@link TASTE_CATEGORY_ORDER}
 * 순서를 따르고, 목록에 없는 카테고리는 처음 등장한 순서로 뒤에 붙인다.
 * 각 카테고리 내부 선택지 순서는 백엔드가 준 순서를 유지한다.
 */
export function groupDescriptorsByCategory(descriptors: TasteDescriptor[]): TasteCategoryGroup[] {
  const byCategory = new Map<string, TasteDescriptor[]>();
  for (const descriptor of descriptors) {
    const list = byCategory.get(descriptor.category) ?? [];
    list.push(descriptor);
    byCategory.set(descriptor.category, list);
  }

  const orderIndex = new Map<string, number>(TASTE_CATEGORY_ORDER.map((code, i) => [code, i]));
  const sortedCategories = [...byCategory.keys()].sort((a, b) => {
    const ai = orderIndex.get(a) ?? Number.MAX_SAFE_INTEGER;
    const bi = orderIndex.get(b) ?? Number.MAX_SAFE_INTEGER;
    return ai - bi;
  });

  return sortedCategories.map((category) => ({
    category,
    label: TASTE_CATEGORY_LABELS[category] ?? category,
    descriptors: byCategory.get(category) ?? [],
  }));
}
