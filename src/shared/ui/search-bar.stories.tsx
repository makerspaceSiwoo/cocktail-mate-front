import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchBar } from "./search-bar";

const meta: Meta<typeof SearchBar> = {
  title: "shared/SearchBar",
  component: SearchBar,
  parameters: {
    docs: {
      description: {
        component:
          "둥근 검색 입력창. value 유무에 따라 텍스트 색상 변경. 좌측 ← 아이콘과 우측 검색 버튼은 props로 토글. 사용처: 검색 홈 / 검색 결과 / 탐색.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }} className="bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Empty: Story = {
  args: { onBack: () => undefined },
};

export const WithValue: Story = {
  args: { value: "모히토", onBack: () => undefined },
};

export const NoButton: Story = {
  args: { placeholder: "칵테일 맵 검색", withButton: false },
};
