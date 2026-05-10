import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "./icon";
import { PageHeader } from "./page-header";

const meta: Meta<typeof PageHeader> = {
  title: "shared/PageHeader",
  component: PageHeader,
  parameters: {
    docs: {
      description: {
        component:
          "화면 최상단 헤더. 좌측 로고/타이틀(Cormorant Garamond 세리프) + 우측 아이콘 슬롯. 사용처: 홈 / 칵테일 목록.",
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
type Story = StoryObj<typeof PageHeader>;

export const TwoIcons: Story = {
  args: {
    right: (
      <>
        <Icon.Bell size={24} color="var(--foreground)" />
        <Icon.Search size={24} color="var(--foreground)" />
      </>
    ),
  },
};

export const OneIcon: Story = {
  args: {
    right: <Icon.Search size={24} color="var(--foreground)" />,
  },
};

export const NoRight: Story = { args: {} };
