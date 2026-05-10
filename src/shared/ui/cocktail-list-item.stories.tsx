import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { COCKTAILS_BY_ID } from "@/entities/cocktail/fixtures";
import { CocktailListItem } from "./cocktail-list-item";

const meta: Meta<typeof CocktailListItem> = {
  title: "shared/CocktailListItem",
  component: CocktailListItem,
  parameters: {
    docs: {
      description: {
        component:
          "원형 이미지, 이름, 칩, 설명, 메타 정보(난이도/조회수), 좋아요 아이콘으로 구성된 가로형 리스트 항목입니다. 사용처: 칵테일 목록 / 검색 결과.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 340, padding: 22 }} className="bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CocktailListItem>;

export const Default: Story = {
  args: { cocktail: COCKTAILS_BY_ID["margarita"], liked: true, divider: false },
};

export const NoHeart: Story = {
  args: {
    cocktail: COCKTAILS_BY_ID["classic-mojito"],
    showHeart: false,
    divider: false,
  },
};

export const NoAlcoholTag: Story = {
  args: {
    cocktail: COCKTAILS_BY_ID["virgin-mojito"],
    liked: false,
    divider: false,
  },
};

export const ListWithDivider: Story = {
  render: () => (
    <div>
      <CocktailListItem cocktail={COCKTAILS_BY_ID["mojito"]} liked />
      <CocktailListItem cocktail={COCKTAILS_BY_ID["old-fashioned"]} liked />
      <CocktailListItem cocktail={COCKTAILS_BY_ID["martini"]} liked divider={false} />
    </div>
  ),
};
