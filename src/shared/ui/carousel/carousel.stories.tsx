import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Carousel } from "./carousel";

const meta: Meta<typeof Carousel> = {
  title: "shared/ui/Carousel",
  component: Carousel,
  args: {
    autoSlide: true,
  },
  argTypes: {
    autoSlide: { control: "boolean" },
    slideInterval: { control: { type: "number", min: 1000, step: 500 } },
    defaultIndex: { control: { type: "number", min: 0 } },
  },
  // No size wrapper — the component owns its default 340x220 frame.
};

export default meta;

type Story = StoryObj<typeof Carousel>;

// Local cocktail photos served from /public/cocktails/.
const cocktails = [
  "/cocktails/mojito.jpg",
  "/cocktails/margarita.jpg",
  "/cocktails/negroni.jpg",
  "/cocktails/cosmopolitan.jpg",
];

// Single image — no dots, no auto-advance.
export const Single: Story = {
  args: {
    images: [cocktails[0]!],
    title: "코스모폴리탄",
    description: "상큼한 라임과 크랜베리의 조화",
  },
};

// Multiple images — drag, dots, infinite forward auto-slide.
export const Multiple: Story = {
  args: {
    images: cocktails,
    title: "오늘의 추천",
    description: "지금 가장 인기있는 칵테일",
  },
};

// Auto-slide off — drag or click a dot to move.
export const NoAutoSlide: Story = {
  args: {
    images: cocktails,
    autoSlide: false,
  },
};

// No overlay — dots still show in their own dark band at the bottom.
export const NoOverlay: Story = {
  args: {
    images: cocktails,
  },
};

// Starts at slide 3 (defaultIndex=2). Drag / autoslide still rotate forever.
export const StartsAtThird: Story = {
  args: {
    images: cocktails,
    defaultIndex: 2,
    title: "Start at slide 3",
  },
};
