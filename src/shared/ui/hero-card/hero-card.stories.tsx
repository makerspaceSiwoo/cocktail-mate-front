import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HeroCard } from "./hero-card";

const meta: Meta<typeof HeroCard> = {
  title: "shared/ui/HeroCard",
  component: HeroCard,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof HeroCard>;

export const Cosmopolitan: Story = {
  args: {
    name: "코스모폴리탄",
    description:
      "상큼한 라임과 크랜베리의 조화, 세련된 분위기를 완성하는 칵테일",
    abv: 20,
    indexCurrent: 1,
    indexTotal: 5,
    gradient: "linear-gradient(33deg, #c33756 39%, #752133 110%)",
  },
};

export const BlueHawaii: Story = {
  args: {
    name: "블루 하와이",
    description: "시원한 트로피컬 블루의 청량함을 담은 칵테일",
    abv: 15,
    indexCurrent: 2,
    indexTotal: 5,
    gradient: "linear-gradient(33deg, #4aa1d9 39%, #1f5a87 110%)",
  },
};

export const Negroni: Story = {
  args: {
    name: "네그로니",
    description: "쌉쌀한 캄파리와 진의 클래식 조합",
    abv: 28,
    indexCurrent: 3,
    indexTotal: 5,
    gradient: "linear-gradient(33deg, #c14040 39%, #6b1f1f 110%)",
  },
};

export const Margarita: Story = {
  args: {
    name: "마가리타",
    description: "라임과 소금이 만나 완성되는 가장 사랑받는 클래식",
    abv: 18,
    indexLabel: false,
    gradient: "linear-gradient(33deg, #e9d785 39%, #a08732 110%)",
  },
};
