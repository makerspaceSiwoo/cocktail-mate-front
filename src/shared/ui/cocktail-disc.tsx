import type { Cocktail } from "@/entities/cocktail/types";
import { SkelCircle } from "./skel";

interface CocktailDiscProps {
  cocktail: Cocktail;
  size?: number;
  labelSize?: number;
  onClick?: () => void;
}

export function CocktailDisc({
  cocktail,
  size = 70,
  labelSize = 11,
  onClick,
}: CocktailDiscProps) {
  return (
    <div
      onClick={onClick}
      style={{ width: size + 20, cursor: onClick ? "pointer" : "default" }}
      className="flex flex-col items-center gap-2"
    >
      <SkelCircle size={size} color={cocktail.tint} />
      <div
        className="text-center font-medium leading-tight whitespace-pre-line text-foreground"
        style={{ fontSize: labelSize }}
      >
        {cocktail.name}
      </div>
    </div>
  );
}
