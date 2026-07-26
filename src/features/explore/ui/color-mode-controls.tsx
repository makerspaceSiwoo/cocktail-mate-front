"use client";

import { SoloLegend } from "@/shared/ui/solo-legend";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { legendItemsForMode, type ColorMode } from "../model";

interface ColorModeControlsProps {
  mode: ColorMode;
  onModeChange: (mode: ColorMode) => void;
  selectedLegendId: string | null;
  onLegendChange: (selectedId: string | null) => void;
}

const MODES: { value: ColorMode; label: string }[] = [
  { value: "abv", label: "도수" },
  { value: "base", label: "베이스" },
];

export function ColorModeControls({
  mode,
  onModeChange,
  selectedLegendId,
  onLegendChange,
}: ColorModeControlsProps) {
  const currentItems = legendItemsForMode(mode);

  return (
    <div className="flex flex-col gap-4 p-4">
      <Tabs value={mode} onValueChange={(value) => onModeChange(value as ColorMode)}>
        <TabsList className="gap-2 border-b-0">
          {MODES.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="px-2 py-0 pb-2 text-[13px] leading-5 font-bold"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="h-20 overflow-hidden">
        <SoloLegend
          items={currentItems}
          selectedId={selectedLegendId}
          onChange={onLegendChange}
          size="sm"
        />
      </div>
    </div>
  );
}
