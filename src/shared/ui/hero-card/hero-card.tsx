import * as React from "react";

import { cn } from "@/shared/lib";

export interface HeroCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description: string;
  abv: number;
  indexLabel?: boolean;
  indexCurrent?: number;
  indexTotal?: number;
  gradient: string;
}

export function HeroCard({
  name,
  description,
  abv,
  indexLabel = true,
  indexCurrent = 1,
  indexTotal = 5,
  gradient,
  className,
  ...rest
}: HeroCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[18px] w-[340px] h-[220px]",
        className,
      )}
      {...rest}
    >
      <div
        className="absolute inset-0"
        style={{ background: gradient }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-black/55"
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-5.5 gap-1.5">
        <h3
          className="font-bold text-2xl text-white tracking-[-0.02em]"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          {name}
        </h3>
        <p className="text-xs text-white leading-snug">{description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="bg-black/30 px-3 py-1 rounded-full text-[11.5px] font-semibold text-white">
            도수 {abv}%
          </span>
          {indexLabel ? (
            <span className="bg-black/30 px-3 py-1 rounded-full text-[11.5px] font-semibold text-white">
              {indexCurrent}/{indexTotal}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
