import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/shared/ui/button";
import { CocktailDisc } from "@/shared/ui/cocktail-disc";

import {
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetRoot,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "./bottom-sheet";

const meta: Meta = {
  title: "shared/ui/BottomSheet",
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const WithCocktailItem: Story = {
  render: () => (
    <BottomSheetRoot>
      <BottomSheetTrigger asChild>
        <Button variant="primary">바텀시트 열기</Button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <div className="flex items-center gap-3.5 pb-4">
          <CocktailDisc name="" color="#f0d4dc" />
          <div className="flex flex-col gap-1.5 min-w-0">
            <BottomSheetTitle>코스모폴리탄</BottomSheetTitle>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold text-text"
                style={{ backgroundColor: "#e4d4f0" }}
              >
                보드카
              </span>
              <span className="w-px h-2.5 bg-border" aria-hidden="true" />
              <span className="text-[11.5px] text-muted">도수 20%</span>
            </div>
            <BottomSheetDescription>
              상큼한 라임과 크랜베리의 조화
            </BottomSheetDescription>
          </div>
        </div>
        <Button variant="cta" size="lg" fullWidth>
          레시피 보기
        </Button>
      </BottomSheetContent>
    </BottomSheetRoot>
  ),
};

export const Empty: Story = {
  render: () => (
    <BottomSheetRoot>
      <BottomSheetTrigger asChild>
        <Button variant="primary">바텀시트 열기</Button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetTitle className="pb-4">알림</BottomSheetTitle>
        <BottomSheetDescription className="sr-only">
          확인 안내 다이얼로그
        </BottomSheetDescription>
        <Button variant="cta" size="lg" fullWidth>
          확인
        </Button>
      </BottomSheetContent>
    </BottomSheetRoot>
  ),
};
