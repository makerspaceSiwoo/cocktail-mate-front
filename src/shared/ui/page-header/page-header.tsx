"use client";

import * as React from "react";

import { cn } from "@/shared/lib";
import { IconButton } from "@/shared/ui/button";
import { Icon, type IconName } from "@/shared/ui/icon";

export interface PageHeaderAction {
  icon: IconName;
  "aria-label": string;
  onClick?: () => void;
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  actions?: PageHeaderAction[];
}

export function PageHeader({
  title = "CocktailMate",
  actions,
  className,
  ...rest
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between h-[60px] w-[360px] px-[22px] pt-[14px] pb-[16px] bg-bg",
        className,
      )}
      {...rest}
    >
      <h1
        className="font-bold text-[26px] text-text tracking-[-0.52px]"
        style={{ fontFamily: '"Cormorant Garamond", serif' }}
      >
        {title}
      </h1>
      {actions && actions.length > 0 ? (
        <div className="flex gap-4">
          {actions.map((action) => (
            <IconButton
              key={action["aria-label"]}
              variant="naked"
              aria-label={action["aria-label"]}
              onClick={action.onClick}
              icon={<Icon name={action.icon} size={24} />}
            />
          ))}
        </div>
      ) : null}
    </header>
  );
}
