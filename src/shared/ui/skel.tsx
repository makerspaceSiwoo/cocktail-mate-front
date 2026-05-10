import type { CSSProperties } from "react";

interface SkelProps {
  w: number;
  h: number;
  r?: number;
  color?: string;
  style?: CSSProperties;
}

export function Skel({ w, h, r = 12, color, style }: SkelProps) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background: color ?? "#f0e6d8",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

interface SkelCircleProps {
  size: number;
  color?: string;
  style?: CSSProperties;
}

export function SkelCircle({ size, color, style }: SkelCircleProps) {
  return <Skel w={size} h={size} r={size / 2} color={color} style={style} />;
}
