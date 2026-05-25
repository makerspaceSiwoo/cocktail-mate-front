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
    index: { control: { type: "number", min: 0 } },
  },
  decorators: [
    (Story) => (
      <div className="w-[340px] h-[220px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Carousel>;

const cocktails = [
  "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80",
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
  "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
  "https://images.unsplash.com/photo-1587223962930-cb7f31384c19?w=800&q=80",
];

// Single image — no dots, no auto-advance side-effect.
export const Single: Story = {
  args: {
    images: [cocktails[0]!],
    title: "코스모폴리탄",
    description: "상큼한 라임과 크랜베리의 조화",
  },
};

// Multiple images — dots show, auto-slides every 4s.
export const Multiple: Story = {
  args: {
    images: cocktails,
    title: "오늘의 추천",
    description: "지금 가장 인기있는 칵테일",
  },
};

// Auto-slide off — only manual dot navigation moves slides.
export const NoAutoSlide: Story = {
  args: {
    images: cocktails,
    autoSlide: false,
  },
};

// Controlled — parent owns the index.
export const Controlled: Story = {
  args: {
    images: cocktails,
    index: 2,
    title: "Controlled at slide 3",
  },
};

// No overlay — pure image carousel.
export const NoOverlay: Story = {
  args: {
    images: cocktails,
  },
};
