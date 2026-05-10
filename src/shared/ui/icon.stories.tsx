import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon, type IconName } from "./icon";

const meta: Meta = {
  title: "shared/Icon",
  parameters: {
    docs: {
      description: {
        component:
          "화면 전반과 하단 탭바에서 사용하는 stroke / filled 아이콘 세트. 모든 아이콘은 size, color (filled 아이콘은 추가로 filled prop)를 받음.",
      },
    },
  },
};

export default meta;

interface IconCellProps {
  name: IconName;
  filled?: boolean;
}

function IconCell({ name, filled }: IconCellProps) {
  const Comp = Icon[name] as (props: {
    size?: number;
    color?: string;
    filled?: boolean;
  }) => React.ReactElement;
  return (
    <div
      className="flex w-[110px] flex-col items-center gap-2 rounded-xl border border-border bg-card"
      style={{ padding: "14px 10px" }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-lg"
        style={{ background: "#f6f1e8" }}
      >
        <Comp size={28} color="var(--foreground)" filled={filled} />
      </div>
      <div
        className="text-center font-semibold text-foreground"
        style={{ fontSize: 11 }}
      >
        {name}
        {filled ? " · filled" : ""}
      </div>
    </div>
  );
}

function Grid({ items }: { items: { name: IconName; filled?: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((it, i) => (
        <IconCell key={`${it.name}-${it.filled ? "f" : "o"}-${i}`} {...it} />
      ))}
    </div>
  );
}

type Story = StoryObj;

export const TabIcons: Story = {
  render: () => (
    <div className="bg-background" style={{ padding: 24 }}>
      <Grid
        items={[
          { name: "TabHome", filled: false },
          { name: "TabHome", filled: true },
          { name: "TabExplore", filled: false },
          { name: "TabExplore", filled: true },
          { name: "TabCocktail", filled: false },
          { name: "TabCocktail", filled: true },
          { name: "TabMy", filled: false },
          { name: "TabMy", filled: true },
        ]}
      />
    </div>
  ),
};

export const GeneralIcons: Story = {
  render: () => (
    <div className="bg-background" style={{ padding: 24 }}>
      <Grid
        items={[
          { name: "Bell" },
          { name: "Search" },
          { name: "ChevronLeft" },
          { name: "ChevronRight" },
          { name: "Filter" },
          { name: "Eye" },
          { name: "Glass" },
          { name: "Heart", filled: false },
          { name: "Heart", filled: true },
          { name: "Share" },
          { name: "Close" },
          { name: "ArrowUpRight" },
          { name: "Settings" },
          { name: "Play" },
          { name: "Star", filled: false },
          { name: "Star", filled: true },
        ]}
      />
    </div>
  ),
};
