interface CategoryChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function CategoryChip({ label, active, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 cursor-pointer rounded-full px-4 py-2 transition-colors ${
        active
          ? "bg-foreground font-bold text-background"
          : "bg-transparent font-medium text-muted-foreground"
      }`}
      style={{ fontSize: 13 }}
    >
      {label}
    </button>
  );
}
