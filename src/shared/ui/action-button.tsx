import type { ComponentType } from "react";

interface IconLikeProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

interface ActionButtonProps {
  Icon: ComponentType<IconLikeProps>;
  label: string;
  count?: string | number;
  color?: string;
  filled?: boolean;
  onClick?: () => void;
}

export function ActionButton({
  Icon: IconComp,
  label,
  count,
  color = "var(--muted-foreground)",
  filled,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 rounded-[14px] border border-[color:var(--border-soft)] bg-card ${
        onClick ? "cursor-pointer" : ""
      }`}
      style={{ padding: "14px 0", color }}
    >
      <IconComp size={22} color={color} filled={filled} />
      <span
        className="leading-none"
        style={{ fontSize: 14, color, fontWeight: filled ? 700 : 500 }}
      >
        {label}
      </span>
      {count != null && (
        <span
          className="leading-none opacity-85"
          style={{ fontSize: 13, color, fontWeight: 600 }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
