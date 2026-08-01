import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import * as React from "react";

import { Chip } from "./chip";

const meta: Meta<typeof Chip> = {
  title: "shared/ui/Chip",
  component: Chip,
  args: {
    label: "전체",
    active: false,
    onClick: fn(),
  },
  argTypes: {
    active: { control: "boolean" },
    label: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Chip>;

// Inactive filter chip.
export const Inactive: Story = {
  args: { active: false, label: "럼" },
};

// Active filter chip.
export const Active: Story = {
  args: { active: true, label: "전체" },
};

// Chip with the remove (X) button — click fires onRemove only.
export const Removable: Story = {
  args: {
    label: "모히토",
    onRemove: fn(),
  },
};

// Filter row mimicking real usage — one ALL chip is active by default and
// clicking another chip swaps the active selection. Parent owns state and
// fires its API call inside the handler.
export const FilterGroup: Story = {
  render: () => {
    const filters = ["전체", "럼", "진", "위스키", "보드카", "무알콜"];
    const [active, setActive] = React.useState("전체");
    return (
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((label) => (
          <Chip
            key={label}
            label={label}
            active={active === label}
            onClick={() => {
              setActive(label);
              // Consumer wires the API call here.
              // fetch(`/cocktails?filter=${label}`)
            }}
          />
        ))}
      </div>
    );
  },
};

// Recent-search row — chips are removable and clicking the body fires a
// separate onClick (e.g. fill the search input). Removing one is local state.
export const RecentSearches: Story = {
  render: () => {
    const [items, setItems] = React.useState(["모히토", "에스프레소 마티니", "네그로니"]);
    return (
      <div className="flex flex-wrap items-center gap-2">
        {items.map((label) => (
          <Chip
            key={label}
            label={label}
            onClick={() => {
              // fill search input
            }}
            onRemove={() => setItems((prev) => prev.filter((i) => i !== label))}
          />
        ))}
      </div>
    );
  },
};

// Disabled state.
export const Disabled: Story = {
  args: {
    label: "비활성",
    disabled: true,
  },
};
