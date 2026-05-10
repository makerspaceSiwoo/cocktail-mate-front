import type { Cocktail } from "@/entities/cocktail/types";

function darkenHex(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const f = (n: number) =>
    Math.max(0, Math.floor(n * 0.6))
      .toString(16)
      .padStart(2, "0");
  return `#${f(r)}${f(g)}${f(b)}`;
}

interface HeroCardProps {
  cocktail: Cocktail;
  indexLabel?: string;
  image?: string;
  onClick?: () => void;
}

export function HeroCard({ cocktail: c, indexLabel, image, onClick }: HeroCardProps) {
  const bg = image
    ? `url(${image}) center/cover no-repeat`
    : `linear-gradient(135deg, ${c.color} 0%, ${darkenHex(c.color)} 100%)`;
  return (
    <div
      onClick={onClick}
      className="relative flex shrink-0 cursor-pointer flex-col justify-end overflow-hidden text-white"
      style={{ width: 296, height: 220, borderRadius: 18, background: bg, padding: 22 }}
    >
      {!image && (
        <svg
          viewBox="0 0 100 100"
          className="absolute opacity-20"
          style={{ right: -10, top: 4, width: 180, height: 180 }}
        >
          <ellipse cx="50" cy="35" rx="32" ry="10" fill="none" stroke="#fff" strokeWidth="1.2" />
          <path d="M22 40c0 0 8 25 28 25s28-25 28-25" fill="none" stroke="#fff" strokeWidth="1.2" />
          <path d="M50 65v22M38 87h24" stroke="#fff" strokeWidth="1.2" fill="none" />
        </svg>
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
        }}
      />
      <div
        className="relative mb-1.5 font-bold"
        style={{
          fontSize: 24,
          letterSpacing: "-0.02em",
          fontFamily: "var(--font-serif)",
        }}
      >
        {c.name}
      </div>
      <div
        className="relative mb-3 leading-relaxed whitespace-pre-line opacity-90"
        style={{ fontSize: 12 }}
      >
        {c.desc}
      </div>
      <div className="relative flex items-center justify-between">
        <div
          className="rounded-full bg-black/30 font-semibold"
          style={{ padding: "5px 12px", fontSize: 11.5 }}
        >
          도수 {c.abv}%
        </div>
        {indexLabel && (
          <div
            className="rounded-full bg-black/30 font-semibold"
            style={{ padding: "5px 12px", fontSize: 11.5 }}
          >
            {indexLabel}
          </div>
        )}
      </div>
    </div>
  );
}
