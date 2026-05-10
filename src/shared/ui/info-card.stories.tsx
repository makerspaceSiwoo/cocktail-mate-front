import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InfoCard } from "./info-card";

const meta: Meta<typeof InfoCard> = {
  title: "shared/InfoCard",
  component: InfoCard,
  parameters: {
    docs: {
      description: {
        component:
          "둥근 모서리 + 얇은 테두리의 카드 컨테이너. 상세 페이지의 설명 / 재료 등 정보 블록을 감싼다. 사용처: 상세.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background" style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InfoCard>;

export const Description: Story = {
  render: () => (
    <InfoCard>
      <div className="mb-2.5 font-bold text-foreground" style={{ fontSize: 16 }}>
        설명
      </div>
      <div
        className="leading-relaxed text-foreground"
        style={{ fontSize: 13 }}
      >
        신선한 라임과 민트의 향이 어우러진 상쾌한 무알콜 칵테일입니다.
      </div>
    </InfoCard>
  ),
};

export const Ingredients: Story = {
  render: () => (
    <InfoCard>
      <div className="mb-2.5 font-bold text-foreground" style={{ fontSize: 16 }}>
        재료
      </div>
      <div
        className="leading-relaxed text-foreground"
        style={{ fontSize: 13 }}
      >
        라임 1/2개, 민트 8장
      </div>
    </InfoCard>
  ),
};
