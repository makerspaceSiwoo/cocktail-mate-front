import { Icon } from "./icon";

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onBack?: () => void;
  withButton?: boolean;
  onSearch?: () => void;
}

export function SearchBar({
  value,
  placeholder = "검색어를 입력해주세요",
  onBack,
  withButton = true,
  onSearch,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 px-[18px] pt-4 pb-3.5">
      {onBack && (
        <button type="button" onClick={onBack} className="cursor-pointer">
          <Icon.ChevronLeft size={26} color="var(--foreground)" />
        </button>
      )}
      <div className="relative flex flex-1 items-center rounded-full border border-border bg-card px-4 py-2.5">
        <span
          className="flex-1 truncate"
          style={{
            fontSize: 13.5,
            color: value ? "var(--foreground)" : "var(--muted-foreground)",
            fontWeight: value ? 500 : 400,
          }}
        >
          {value || placeholder}
        </span>
        {withButton && (
          <button
            type="button"
            onClick={onSearch}
            className="absolute top-1/2 right-1 flex h-[34px] w-[34px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-foreground"
          >
            <Icon.Search
              size={16}
              color="var(--background)"
              strokeWidth={2.2}
            />
          </button>
        )}
      </div>
    </div>
  );
}
