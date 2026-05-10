import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActionButton } from "./action-button";
import { Icon } from "./icon";

const meta: Meta<typeof ActionButton> = {
  title: "shared/ActionButton",
  component: ActionButton,
  parameters: {
    docs: {
      description: {
        component:
          "아이콘 + 라벨 + (선택) 카운트의 outlined 액션 버튼. filled 상태에서 컬러가 강조됨. 사용처: 상세 — 좋아요 / 공유.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background" style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

export const Liked: Story = {
  args: {
    Icon: Icon.Heart,
    label: "좋아요",
    count: "2.3k",
    color: "var(--heart)",
    filled: true,
  },
};

export const Share: Story = {
  args: {
    Icon: Icon.Share,
    label: "공유",
    color: "var(--muted-foreground)",
  },
};

export const TwoColumn: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 8,
        width: 300,
      }}
    >
      <ActionButton
        Icon={Icon.Heart}
        label="좋아요"
        count="2.3k"
        color="var(--heart)"
        filled
      />
      <ActionButton Icon={Icon.Share} label="공유" color="var(--muted-foreground)" />
    </div>
  ),
};
