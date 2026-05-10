import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionHeader } from "./section-header";

const meta: Meta<typeof SectionHeader> = {
  title: "shared/SectionHeader",
  component: SectionHeader,
  parameters: {
    docs: {
      description: {
        component:
          "섹션 제목 + 우측 액션(예: 더보기) 링크. 사용처: 홈 / 검색 홈.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background" style={{ width: 340 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const TitleOnly: Story = { args: { title: "오늘의 추천" } };
export const WithAction: Story = {
  args: { title: "나를 위한 Pick", action: "더보기" },
};
