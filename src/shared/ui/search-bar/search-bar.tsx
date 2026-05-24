"use client";

import * as React from "react";

import { cn } from "@/shared/lib";
import { ChevronLeftIcon, SearchIcon } from "@/shared/ui/icon";

export interface SearchBarProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange"
  > {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  showBack?: boolean;
  showSearchButton?: boolean;
  onBack?: () => void;
  onSearch?: (value: string) => void;
}

export function SearchBar({
  value,
  defaultValue,
  onChange,
  placeholder = "검색어를 입력해주세요",
  showBack = true,
  showSearchButton = true,
  onBack,
  onSearch,
  className,
  ...rest
}: SearchBarProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const current = isControlled ? value : internal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const handleSubmit = () => {
    onSearch?.(current);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 w-[375px] px-[18px] pt-4 pb-3.5 bg-bg",
        className,
      )}
      {...rest}
    >
      {showBack ? (
        <button
          type="button"
          aria-label="뒤로"
          onClick={onBack}
          className="inline-flex items-center justify-center text-text rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ChevronLeftIcon size={26} />
        </button>
      ) : null}
      <div className="flex-1 flex items-center gap-2 pl-4 pr-1 py-2.5 rounded-full bg-search-bg border border-border">
        <input
          type="text"
          value={current}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-[13.5px] text-text placeholder:text-muted cursor-text"
        />
        {showSearchButton ? (
          <button
            type="button"
            aria-label="검색"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center size-[34px] rounded-full bg-text text-bg transition-opacity cursor-pointer hover:opacity-90 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <SearchIcon size={16} className="text-bg" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
