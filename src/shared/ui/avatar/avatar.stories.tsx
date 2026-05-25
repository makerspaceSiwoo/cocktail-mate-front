import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Avatar } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "shared/ui/Avatar",
  component: Avatar,
  args: {
    alt: "사용자 아바타",
  },
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    src: { control: "text" },
    fallbackColor: { control: "color" },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

// Image avatar — loads a real photo.
export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/120?img=12",
  },
};

// No src → fallback color tile (chip-bg token by default).
export const Fallback: Story = {
  args: {
    src: undefined,
  },
};

// Solid color disc — replaces the deleted CocktailDisc primitive.
export const ColorDisc: Story = {
  args: {
    src: undefined,
    fallbackColor: "#e2eed8",
    size: "lg",
  },
};

// Initials inside the fallback.
export const Initials: Story = {
  args: {
    src: undefined,
    fallbackColor: "#fde0c8",
    fallback: <span className="text-base font-bold">JS</span>,
  },
};

// All sizes side by side.
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar alt="sm" size="sm" fallbackColor="#f0d4dc" />
      <Avatar alt="md" size="md" fallbackColor="#e4d4f0" />
      <Avatar alt="lg" size="lg" fallbackColor="#fde0c8" />
    </div>
  ),
};
