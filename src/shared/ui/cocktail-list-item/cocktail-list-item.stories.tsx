import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CocktailListItem } from "./cocktail-list-item";

const meta: Meta<typeof CocktailListItem> = {
  title: "shared/ui/CocktailListItem",
  component: CocktailListItem,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] mx-auto bg-bg px-[22px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CocktailListItem>;

export const Liked: Story = {
  args: {
    name: "마가리타",
    discColor: "#fde0c8",
    tag: { label: "데킬라", color: "#fde0c8" },
    description: "상큼한 라임과 소금의 클래식한 조합",
    difficulty: "중",
    abv: 18,
    likes: "12.4k",
    defaultLiked: true,
  },
};

export const Unliked: Story = {
  args: {
    name: "코스모폴리탄",
    discColor: "#f0d4dc",
    tag: { label: "보드카", color: "#e4d4f0" },
    description: "라임과 크랜베리의 세련된 칵테일",
    difficulty: "쉬움",
    abv: 20,
    likes: "8.9k",
    defaultLiked: false,
  },
};

export const NoAlcohol: Story = {
  args: {
    name: "버진 모히토",
    discColor: "#e2eed8",
    tag: { label: "무알콜", color: "#d4f0d8" },
    description: "민트와 라임의 상쾌한 무알콜 칵테일",
    difficulty: "쉬움",
    abv: 0,
    likes: "3.2k",
    defaultLiked: false,
  },
};

export const Group: Story = {
  render: () => (
    <div className="flex flex-col divide-y divide-border-soft">
      <CocktailListItem
        name="마가리타"
        discColor="#fde0c8"
        tag={{ label: "데킬라", color: "#fde0c8" }}
        description="상큼한 라임과 소금의 클래식한 조합"
        difficulty="중"
        abv={18}
        likes="12.4k"
        defaultLiked
      />
      <CocktailListItem
        name="코스모폴리탄"
        discColor="#f0d4dc"
        tag={{ label: "보드카", color: "#e4d4f0" }}
        description="라임과 크랜베리의 세련된 칵테일"
        difficulty="쉬움"
        abv={20}
        likes="8.9k"
      />
      <CocktailListItem
        name="버진 모히토"
        discColor="#e2eed8"
        tag={{ label: "무알콜", color: "#d4f0d8" }}
        description="민트와 라임의 상쾌한 무알콜 칵테일"
        difficulty="쉬움"
        abv={0}
        likes="3.2k"
      />
    </div>
  ),
};
