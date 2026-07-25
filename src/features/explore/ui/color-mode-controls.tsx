"use client";

import { BASE_TAG_MAP, BASE_TAGS } from "@/entities/cocktail";
import { Chip } from "@/shared/ui/chip";

import { ABV_BUCKETS, type ColorMode } from "../model";

interface ColorModeControlsProps {
  mode: ColorMode;
  onModeChange: (mode: ColorMode) => void;
}

const MODES: { value: ColorMode; label: string }[] = [
  { value: "cluster", label: "클러스터" },
  { value: "abv", label: "도수" },
  { value: "base", label: "베이스" },
];

interface LegendItem {
  label: string;
  color: string;
}

/** 모드별 범례 항목. 클러스터는 색상 설명 없음(빈 배열). */
function legendFor(mode: ColorMode): LegendItem[] {
  if (mode === "abv") {
    return ABV_BUCKETS.map((b) => ({ label: b.label, color: b.color }));
  }
  if (mode === "base") {
    return BASE_TAGS.map((tag) => ({
      label: BASE_TAG_MAP[tag].label,
      color: BASE_TAG_MAP[tag].color,
    }));
  }
  return [];
}

/**
 * 캔버스 바로 아래에 두는 색상 모드 버튼 + 범례.
 *
 * - 버튼: 클러스터 / 도수 / 베이스 로 포인트 색상 기준을 전환.
 * - 범례: 도수·베이스 모드일 때만 색상 설명을 버튼 하단에 노출(클러스터는 없음).
 * (상세 시트가 열리면 이 영역은 backdrop 에 가려진다.)
 */
export function ColorModeControls({ mode, onModeChange }: ColorModeControlsProps) {
  const legend = legendFor(mode);

  return (
    <div className="flex flex-col gap-3 px-[22px]">
      <div className="flex gap-1.5">
        {MODES.map((m) => (
          <Chip
            key={m.value}
            label={m.label}
            active={mode === m.value}
            onClick={() => onModeChange(m.value)}
            className="h-8 px-4 py-0 text-[13px] leading-8 font-bold"
          />
        ))}
      </div>

      {legend.length > 0 ? (
        <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
          {legend.map((item) => (
            <li key={item.label} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted text-[12px] leading-[14px]">{item.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
