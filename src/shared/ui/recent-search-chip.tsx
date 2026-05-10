import { Icon } from "./icon";

interface RecentSearchChipProps {
  label: string;
  onRemove?: () => void;
  onClick?: () => void;
}

export function RecentSearchChip({ label, onRemove, onClick }: RecentSearchChipProps) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-background ${
        onClick ? "cursor-pointer" : ""
      }`}
      style={{ padding: "7px 14px" }}
    >
      <span className="text-foreground" style={{ fontSize: 12 }}>
        {label}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
        className={`flex ${onRemove ? "cursor-pointer" : ""}`}
        aria-label={`${label} 삭제`}
      >
        <Icon.Close size={11} color="var(--muted-foreground)" />
      </button>
    </div>
  );
}
