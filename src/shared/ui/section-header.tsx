import { Icon } from "./icon";

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
  padding?: string;
}

export function SectionHeader({
  title,
  action,
  onAction,
  padding = "0 22px 12px",
}: SectionHeaderProps) {
  return (
    <div
      className="flex items-baseline justify-between"
      style={{ padding }}
    >
      <div
        className="font-bold text-foreground"
        style={{ fontSize: 16, letterSpacing: "-0.02em" }}
      >
        {title}
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="flex cursor-pointer items-center gap-0.5 text-muted-foreground"
          style={{ fontSize: 12 }}
        >
          {action}
          <Icon.ChevronRight size={12} color="var(--muted-foreground)" />
        </button>
      )}
    </div>
  );
}
