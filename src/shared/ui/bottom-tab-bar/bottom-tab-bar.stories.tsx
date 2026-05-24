import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BottomTabBar, FOUR_TAB_ITEMS } from "./bottom-tab-bar";

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

// Uncontrolled — clicking a tab updates its active state in the component.
// Also supports horizontal pointer/touch swipe and arrow-key navigation when focused.
export const Interactive: Story = {
  args: {
    items: FOUR_TAB_ITEMS,
    defaultActiveId: "home",
  },
};

// Controlled — parent owns activeId. Useful as a reference for app integration.
export const Controlled: Story = {
  args: {
    items: FOUR_TAB_ITEMS,
    activeId: "explore",
  },
  argTypes: {
    activeId: {
      control: "select",
      options: ["home", "explore", "cocktail", "my"],
    },
  },
};

// Each item is a real next/link. Clicking still calls onSelect for analytics.
export const WithLinks: Story = {
  args: {
    items: [
      { ...FOUR_TAB_ITEMS[0]!, href: "/" },
      { ...FOUR_TAB_ITEMS[1]!, href: "/explore" },
      { ...FOUR_TAB_ITEMS[2]!, href: "/cocktail" },
      { ...FOUR_TAB_ITEMS[3]!, href: "/me" },
    ],
    defaultActiveId: "home",
  },
};

// Swipe disabled — only click + keyboard.
export const SwipeDisabled: Story = {
  args: {
    items: FOUR_TAB_ITEMS,
    defaultActiveId: "home",
    enableSwipe: false,
  },
};
