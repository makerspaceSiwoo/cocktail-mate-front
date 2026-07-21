"use client";

import { HeartFilledIcon, HeartIcon } from "@/shared/ui/icon/icons";
import { cn } from "@/shared/lib";

import { useLikeToggle } from "../model/use-like-toggle";

interface LikeButtonProps {
  cocktailId: number;
  initialLiked: boolean;
  variant?: "icon" | "action";
  initialLikeCount?: number | null;
  disabled?: boolean;
  className?: string;
  onChanged?: (isLiked: boolean) => void;
}

export function LikeButton({
  cocktailId,
  initialLiked,
  variant = "icon",
  initialLikeCount = null,
  disabled = false,
  className,
  onChanged,
}: LikeButtonProps) {
  const { isLiked, likeCount, errorMessage, isPending, toggle } = useLikeToggle({
    cocktailId,
    initialLiked,
    onChanged,
  });
  const displayedCount = likeCount ?? initialLikeCount;
  const Icon = isLiked ? HeartFilledIcon : HeartIcon;
  const label = isLiked ? "좋아요 취소" : "좋아요";

  return (
    <div className={cn("relative", variant === "action" && "w-full", className)}>
      <button
        type="button"
        onClick={toggle}
        disabled={disabled || isPending}
        aria-label={label}
        aria-pressed={isLiked}
        className={cn(
          "text-heart focus-visible:ring-accent flex items-center justify-center outline-none focus-visible:ring-2 disabled:cursor-wait disabled:opacity-60",
          variant === "icon" && "size-11 rounded-full",
          variant === "action" &&
            "border-border-soft bg-card-bg h-[50px] w-full gap-2 rounded-[14px] border px-4 text-[14px] font-bold",
        )}
      >
        <Icon size={variant === "icon" ? 22 : 20} aria-hidden />
        {variant === "action" ? (
          <>
            <span>좋아요</span>
            {displayedCount !== null ? (
              <span className="text-[13px] font-semibold">
                {displayedCount.toLocaleString("ko-KR")}
              </span>
            ) : null}
          </>
        ) : null}
      </button>
      {errorMessage ? (
        <span className="sr-only" role="status">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}
