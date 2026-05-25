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

// Image avatar — uses a real cocktail photo from /public.
export const WithImage: Story = {
  args: {
    src: "/cocktails/mojito.jpg",
    alt: "모히토",
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

// All sizes side by side — three different cocktail photos.
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar alt="마가리타" size="sm" src="/cocktails/margarita.jpg" />
      <Avatar alt="네그로니" size="md" src="/cocktails/negroni.jpg" />
      <Avatar alt="코스모폴리탄" size="lg" src="/cocktails/cosmopolitan.jpg" />
    </div>
  ),
};
