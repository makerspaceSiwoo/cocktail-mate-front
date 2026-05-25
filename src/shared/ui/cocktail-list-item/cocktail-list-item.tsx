"use client";

import * as React from "react";

import { cn } from "@/shared/lib";
import { GlassIcon, HeartIcon } from "@/shared/ui/icon";
import { LikeButton } from "@/shared/ui/like-button";

export interface CocktailListItemTag {
  label: string;
  color: string;
}

export interface CocktailListItemProps {
  name: string;
  discColor: string;
  tag?: CocktailListItemTag;
  description: string;
  difficulty: "쉬움" | "중" | "어려움";
  abv: number;
  likes: string | number;
  liked?: boolean;
  defaultLiked?: boolean;
  onLikedChange?: (liked: boolean) => void;
  className?: string;
}

export function CocktailListItem({
  name,
  discColor,
  tag,
  description,
  difficulty,
  abv,
  likes,
  liked,
  defaultLiked,
  onLikedChange,
  className,
}: CocktailListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 w-full py-4 bg-bg",
        className,
      )}
    >
      <div
        className="rounded-full size-16 shrink-0"
        style={{ backgroundColor: discColor }}
        aria-hidden="true"
      />
      <div className="flex-1 flex flex-col gap-1.5 min-w-0 overflow-clip">
        <span className="font-bold text-[17px] text-text tracking-[-0.34px] truncate">
          {name}
        </span>
        <div className="flex items-center gap-2 overflow-clip">
          {tag ? (
            <>
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold text-text shrink-0"
                style={{ backgroundColor: tag.color }}
              >
                {tag.label}
              </span>
              <span
                className="w-px h-2.5 bg-border shrink-0"
                aria-hidden="true"
              />
            </>
          ) : null}
          <span className="text-[11.5px] text-muted truncate">
            {description}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1">
            <GlassIcon size={12} className="text-muted" />
            <span className="text-[11px] text-muted">{difficulty}</span>
          </span>
          <span
            className="w-px h-2.5 bg-border"
            aria-hidden="true"
          />
          <span className="text-[11px] text-muted">{abv}%</span>
          <span
            className="w-px h-2.5 bg-border"
            aria-hidden="true"
          />
          <span className="flex items-center gap-1">
            <HeartIcon size={12} className="text-muted" />
            <span className="text-[11px] text-muted">{likes}</span>
          </span>
        </div>
      </div>
      <LikeButtonControl
        liked={liked}
        defaultLiked={defaultLiked}
        onLikedChange={onLikedChange}
      />
    </div>
  );
}

// Internal wrapper that resolves controlled vs uncontrolled liked state
// without exposing the toggle plumbing on CocktailListItem's surface.
function LikeButtonControl({
  liked,
  defaultLiked,
  onLikedChange,
}: {
  liked?: boolean;
  defaultLiked?: boolean;
  onLikedChange?: (next: boolean) => void;
}) {
  const isControlled = liked !== undefined;
  const [internal, setInternal] = React.useState(defaultLiked ?? false);
  const current = isControlled ? liked : internal;

  const handleClick = () => {
    const next = !current;
    if (!isControlled) setInternal(next);
    onLikedChange?.(next);
  };

  return (
    <LikeButton
      aria-label={current ? "찜 해제" : "찜하기"}
      isLiked={current}
      onClick={handleClick}
      size={22}
    />
  );
}
