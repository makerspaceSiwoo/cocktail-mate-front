import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { COCKTAILS_BY_ID } from "@/entities/cocktail/fixtures";
import { CocktailDisc } from "./cocktail-disc";

const meta: Meta<typeof CocktailDisc> = {
  title: "shared/CocktailDisc",
  component: CocktailDisc,
  parameters: {
    docs: {
      description: {
        component:
          "원형 색상 디스크 + 이름 라벨로 구성된 컴포넌트. 홈 '나를 위한 Pick', 상세 '추천 칵테일'에서 사용.",
      },
    },
  },
  argTypes: {
    size: { control: { type: "range", min: 40, max: 120, step: 2 } },
    labelSize: { control: { type: "range", min: 9, max: 16, step: 1 } },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }} className="bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CocktailDisc>;

export const Home: Story = {
  args: { cocktail: COCKTAILS_BY_ID["blue-hawaii"], size: 70 },
  parameters: { docs: { description: { story: "size 70 — 홈 '나를 위한 Pick'" } } },
};

export const Detail: Story = {
  args: { cocktail: COCKTAILS_BY_ID["classic-mojito"], size: 64 },
  parameters: { docs: { description: { story: "size 64 — 상세 '추천 칵테일'" } } },
};

export const Large: Story = {
  args: { cocktail: COCKTAILS_BY_ID["margarita"], size: 88, labelSize: 12 },
};

export const Grid: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "14px 8px",
        justifyItems: "center",
        width: 340,
      }}
    >
      {["blue-hawaii", "pina-colada", "mojito", "gin-tonic"].map((id) => (
        <CocktailDisc key={id} cocktail={COCKTAILS_BY_ID[id]} size={64} />
      ))}
    </div>
  ),
};
