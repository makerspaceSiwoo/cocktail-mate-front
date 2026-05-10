import type { ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  serif?: boolean;
  right?: ReactNode;
}

export function PageHeader({
  title = "CocktailMate",
  serif = true,
  right,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-[22px] pt-3.5 pb-4">
      <div
        className="font-bold text-foreground"
        style={{
          fontFamily: serif ? "var(--font-serif)" : "var(--font-sans)",
          fontSize: 26,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </div>
      {right && <div className="flex gap-4">{right}</div>}
    </div>
  );
}
