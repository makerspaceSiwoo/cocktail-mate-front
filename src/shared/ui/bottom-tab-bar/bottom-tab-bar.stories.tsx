import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  BottomTabBar,
  FIVE_TAB_ITEMS,
  FOUR_TAB_ITEMS,
} from "./bottom-tab-bar";

const meta: Meta<typeof BottomTabBar> = {
  title: "shared/ui/BottomTabBar",
  component: BottomTabBar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="w-[375px] mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof BottomTabBar>;

export const FourTab: Story = {
  args: {
    items: FOUR_TAB_ITEMS,
    activeId: "home",
  },
  argTypes: {
    activeId: {
      control: "select",
      options: ["home", "explore", "cocktail", "my"],
    },
  },
};

export const FiveTab: Story = {
  args: {
    items: FIVE_TAB_ITEMS,
    activeId: "search",
  },
  argTypes: {
    activeId: {
      control: "select",
      options: ["home", "explore", "search", "cocktail", "my"],
    },
  },
};

export const WithLinks: Story = {
  args: {
    items: [
      { ...FOUR_TAB_ITEMS[0], href: "/" },
      { ...FOUR_TAB_ITEMS[1], href: "/explore" },
      { ...FOUR_TAB_ITEMS[2], href: "/cocktail" },
      { ...FOUR_TAB_ITEMS[3], href: "/me" },
    ],
    activeId: "home",
  },
  argTypes: {
    activeId: {
      control: "select",
      options: ["home", "explore", "cocktail", "my"],
    },
  },
};
