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
};

export default meta;

type Story = StoryObj<typeof Carousel>;

const cocktailSlides = [
  {
    src: "/cocktails/mojito.jpg",
    alt: "모히토",
    title: "모히토",
    description: "라임과 민트의 청량한 럼 베이스",
  },
  {
    src: "/cocktails/margarita.jpg",
    alt: "마가리타",
    title: "마가리타",
    description: "데킬라 + 라임 + 트리플섹의 클래식",
  },
  {
    src: "/cocktails/negroni.jpg",
    alt: "네그로니",
    title: "네그로니",
    description: "쌉쌀한 캄파리와 진의 황금 비율",
  },
  {
    src: "/cocktails/cosmopolitan.jpg",
    alt: "코스모폴리탄",
    title: "코스모폴리탄",
    description: "라임과 크랜베리, 세련된 분위기",
  },
];

// Single slide — no dots; just title/description in the band.
export const Single: Story = {
  args: {
    slides: [cocktailSlides[0]!],
  },
};

// Per-slide title/description rotates with the slide.
export const Multiple: Story = {
  args: {
    slides: cocktailSlides,
  },
};

// Auto-slide off — drag or tap a dot to move. Title/description still swap.
export const NoAutoSlide: Story = {
  args: {
    slides: cocktailSlides,
    autoSlide: false,
  },
};

// No per-slide text — band shrinks to just the dots.
export const NoOverlay: Story = {
  args: {
    slides: cocktailSlides.map(({ src, alt }) => ({ src, alt })),
  },
};

// Start at slide 3 (defaultIndex=2).
export const StartsAtThird: Story = {
  args: {
    slides: cocktailSlides,
    defaultIndex: 2,
  },
};

// Stretched to fill a wider 600x360 wrapper via className override.
export const Wider: Story = {
  args: {
    slides: cocktailSlides,
    className: "w-[600px] h-[360px]",
  },
};

// Parent-driven size — Carousel fills its container when given `w-full h-full`.
export const FillParent: Story = {
  render: (args) => (
    <div className="w-[500px] h-[280px] border border-border rounded-2xl overflow-hidden">
      <Carousel {...args} className="w-full h-full rounded-none" />
    </div>
  ),
  args: { slides: cocktailSlides },
};
