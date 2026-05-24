import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CocktailDisc } from "./cocktail-disc";

const meta: Meta<typeof CocktailDisc> = {
  title: "shared/ui/CocktailDisc",
  component: CocktailDisc,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof CocktailDisc>;

export const Default: Story = {
  args: {
    name: "클래식 모히토",
    color: "#e2eed8",
  },
};

export const Large: Story = {
  args: {
    name: "클래식 모히토",
    color: "#e2eed8",
    size: "lg",
  },
};

export const Grid: Story = {
  render: () => (
    <div className="flex gap-3">
      <CocktailDisc name="클래식 모히토" color="#e2eed8" />
      <CocktailDisc name="마가리타" color="#fde0c8" />
      <CocktailDisc name="코스모폴리탄" color="#f0d4dc" />
      <CocktailDisc name="보드카 마티니" color="#e4d4f0" />
    </div>
  ),
};
