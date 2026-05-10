import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { COCKTAILS_BY_ID } from "@/entities/cocktail/fixtures";
import { HeroCard } from "./hero-card";

const meta: Meta<typeof HeroCard> = {
  title: "shared/HeroCard",
  component: HeroCard,
  parameters: {
    docs: {
      description: {
        component:
          "이미지 위에 칵테일 이름, 설명, 도수 정보를 오버레이하는 카드. image prop이 없으면 brand color 그라데이션 placeholder 사용. 사용처: 홈 '오늘의 추천'.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 22 }} className="bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeroCard>;

export const PlaceholderCosmopolitan: Story = {
  args: { cocktail: COCKTAILS_BY_ID["cosmopolitan"], indexLabel: "1/5" },
};

export const PlaceholderBlueHawaii: Story = {
  args: { cocktail: COCKTAILS_BY_ID["blue-hawaii"], indexLabel: "2/5" },
};

export const RealImage: Story = {
  args: {
    cocktail: COCKTAILS_BY_ID["negroni"],
    indexLabel: "3/5",
    image:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80",
  },
};

export const NoIndex: Story = {
  args: { cocktail: COCKTAILS_BY_ID["margarita"] },
};
