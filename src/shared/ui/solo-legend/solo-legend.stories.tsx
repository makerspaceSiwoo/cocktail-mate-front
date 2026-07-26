import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { SoloLegend } from "./solo-legend";

const SAMPLE_ITEMS = [
  { id: "creamy", label: "🥛 Creamy", color: "#A48AF0" },
  { id: "tropical", label: "🌴 Tropical", color: "#F39A5A" },
  { id: "citrus_sweet", label: "🍋 Citrus Sweet", color: "#F0C84D" },
  { id: "herbs_spices", label: "🌿 Herbs & Spices", color: "#5BAA72" },
  { id: "fizz_sparkling", label: "✨ Fizz & Sparkling", color: "#60B8E8" },
] as const;

const meta: Meta<typeof SoloLegend> = {
  title: "shared/ui/SoloLegend",
  component: SoloLegend,
  parameters: {
    layout: "centered",
  },
  args: {
    items: SAMPLE_ITEMS,
    selectedId: null,
    size: "md",
  },
};

export default meta;

type Story = StoryObj<typeof SoloLegend>;

export const Default: Story = {
  render: (args) => {
    const [selectedId, setSelectedId] = React.useState<string | null>(args.selectedId);
    return (
      <div className="bg-bg w-[360px] rounded-2xl p-4">
        <SoloLegend {...args} selectedId={selectedId} onChange={setSelectedId} />
      </div>
    );
  },
};

export const Preselected: Story = {
  args: {
    selectedId: "citrus_sweet",
  },
  render: (args) => {
    const [selectedId, setSelectedId] = React.useState<string | null>(args.selectedId);
    return (
      <div className="bg-bg w-[360px] rounded-2xl p-4">
        <SoloLegend {...args} selectedId={selectedId} onChange={setSelectedId} />
      </div>
    );
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
  render: (args) => {
    const [selectedId, setSelectedId] = React.useState<string | null>(args.selectedId);
    return (
      <div className="bg-bg w-[320px] rounded-2xl p-4">
        <SoloLegend {...args} selectedId={selectedId} onChange={setSelectedId} />
      </div>
    );
  },
};
