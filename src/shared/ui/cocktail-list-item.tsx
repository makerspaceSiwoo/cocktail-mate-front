import type { Cocktail } from "@/entities/cocktail/types";
import { formatLikes } from "@/entities/cocktail/fixtures";
import { Icon } from "./icon";
import { SkelCircle } from "./skel";

interface CocktailListItemProps {
  cocktail: Cocktail;
  onClick?: () => void;
  liked?: boolean;
  showMeta?: boolean;
  showHeart?: boolean;
  divider?: boolean;
}

export function CocktailListItem({
  cocktail: c,
  onClick,
  liked = false,
  showMeta = true,
  showHeart = true,
  divider = true,
}: CocktailListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-[14px] py-4 ${
        onClick ? "cursor-pointer" : ""
      } ${divider ? "border-b border-border" : ""}`}
    >
      <SkelCircle size={64} color={c.tint} />
      <div className="min-w-0 flex-1">
        <div
          className="mb-1.5 font-bold text-foreground"
          style={{ fontSize: 17, letterSpacing: "-0.02em" }}
        >
          {c.name}
        </div>
        <div className="mb-2 flex items-center gap-2">
          <span
            className="rounded-full px-2 py-[3px] font-medium text-foreground"
            style={{
              fontSize: 10.5,
              background: c.tag === "무알콜" ? "var(--tag-noalcohol)" : "var(--chip)",
            }}
          >
            {c.tag ?? c.spirit}
          </span>
          <div className="h-2.5 w-px bg-border" />
          <span
            className="min-w-0 flex-1 overflow-hidden leading-snug whitespace-nowrap text-muted-foreground text-ellipsis"
            style={{ fontSize: 11.5 }}
          >
            {c.desc}
          </span>
        </div>
        {showMeta && (
          <div className="flex items-center gap-[14px]">
            <span
              className="flex items-center gap-1 text-muted-foreground"
              style={{ fontSize: 11 }}
            >
              <Icon.Glass size={12} color="var(--muted-foreground)" />
              난이도 {c.difficulty}
            </span>
            <div className="h-2.5 w-px bg-border" />
            <span
              className="flex items-center gap-1 text-muted-foreground"
              style={{ fontSize: 11 }}
            >
              <Icon.Heart size={12} color="var(--muted-foreground)" />
              {formatLikes(c.likes)}
            </span>
          </div>
        )}
      </div>
      {showHeart && (
        <div className="flex items-center justify-center p-1.5">
          <Icon.Heart
            size={22}
            color={liked ? "var(--heart)" : "var(--muted-foreground)"}
            filled={liked}
          />
        </div>
      )}
    </div>
  );
}
