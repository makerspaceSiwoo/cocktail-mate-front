import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { SearchBar } from "./search-bar";

const meta: Meta<typeof SearchBar> = {
  title: "shared/ui/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
  },
  args: {
    onBack: fn(),
    onSearch: fn(),
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] mx-auto bg-bg">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Empty: Story = {};

export const Filled: Story = {
  args: {
    defaultValue: "모히토",
  },
};

export const NoBack: Story = {
  args: {
    showBack: false,
  },
};

export const NoSearchButton: Story = {
  args: {
    showSearchButton: false,
  },
};

export const Headless: Story = {
  args: {
    showBack: false,
    showSearchButton: false,
  },
};
