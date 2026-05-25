import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Text } from "./text";

const meta: Meta<typeof Text> = {
  title: "shared/ui/Text",
  component: Text,
  args: {
    children: "The quick brown fox jumps over the lazy dog. 가나다라마바사 아자차카타파하.",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["display", "title", "subtitle", "body", "caption", "micro"],
    },
    tone: {
      control: { type: "select" },
      options: ["default", "muted", "heart", "accent", "inverse"],
    },
    weight: {
      control: { type: "select" },
      options: ["regular", "medium", "semibold", "bold"],
    },
    align: { control: { type: "select" }, options: ["left", "center", "right"] },
    truncate: { control: "boolean" },
    as: {
      control: { type: "select" },
      options: ["p", "span", "div", "h1", "h2", "h3", "label"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Body: Story = {
  args: { variant: "body" },
};

export const Display: Story = {
  args: { variant: "display", as: "h1", children: "CocktailMate" },
};

export const Title: Story = {
  args: { variant: "title", as: "h2", children: "코스모폴리탄" },
};

export const Subtitle: Story = {
  args: {
    variant: "subtitle",
    as: "h3",
    children: "나를 위한 Pick",
  },
};

export const Caption: Story = {
  args: { variant: "caption", tone: "muted" },
};

export const Micro: Story = {
  args: { variant: "micro", tone: "muted", children: "12.4k" },
};

// Tone × variant matrix.
export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text variant="body" tone="default">default tone</Text>
      <Text variant="body" tone="muted">muted tone</Text>
      <Text variant="body" tone="heart">heart tone</Text>
      <Text variant="body" tone="accent">accent tone</Text>
      <div className="inline-flex bg-text px-3 py-1.5 rounded">
        <Text variant="body" tone="inverse">inverse tone on dark surface</Text>
      </div>
    </div>
  ),
};

// Truncation in a constrained width.
export const Truncated: Story = {
  render: () => (
    <div className="w-40 border border-border p-2 rounded">
      <Text variant="body" truncate>
        매우 긴 텍스트가 한 줄에 들어가지 않을 때 잘립니다 — 모히토 마가리타 네그로니
      </Text>
    </div>
  ),
};
