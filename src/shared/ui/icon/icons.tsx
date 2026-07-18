import * as React from "react";

type IconBaseProps = {
  size?: number;
  className?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

type StrokeIconProps = IconBaseProps & {
  defaultSize: number;
  viewBox?: string;
  strokeWidth?: number;
  children: React.ReactNode;
};

function StrokeSvg({
  size,
  className,
  defaultSize,
  viewBox = "0 0 24 24",
  strokeWidth = 1.6,
  children,
  ...rest
}: StrokeIconProps) {
  const isLabelled = Boolean(rest["aria-label"]);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? defaultSize}
      height={size ?? defaultSize}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={isLabelled ? "img" : undefined}
      aria-hidden={rest["aria-hidden"] ?? (isLabelled ? undefined : true)}
      aria-label={rest["aria-label"]}
      className={className}
    >
      {children}
    </svg>
  );
}

type FillIconProps = IconBaseProps & {
  defaultSize: number;
  viewBox?: string;
  children: React.ReactNode;
};

function FillSvg({
  size,
  className,
  defaultSize,
  viewBox = "0 0 24 24",
  children,
  ...rest
}: FillIconProps) {
  const isLabelled = Boolean(rest["aria-label"]);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? defaultSize}
      height={size ?? defaultSize}
      viewBox={viewBox}
      fill="currentColor"
      role={isLabelled ? "img" : undefined}
      aria-hidden={rest["aria-hidden"] ?? (isLabelled ? undefined : true)}
      aria-label={rest["aria-label"]}
      className={className}
    >
      {children}
    </svg>
  );
}

export type IconComponentProps = IconBaseProps;

// ---------- Stroke icons ----------

export function BellIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={24} {...props}>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 01-3.4 0" />
    </StrokeSvg>
  );
}

export function SearchIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={24} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </StrokeSvg>
  );
}

export function SearchFilledIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={24} strokeWidth={3} {...props}>
      <circle cx="11" cy="11" r="6.2" />
      <path d="M21 21l-4.35-4.35" />
    </StrokeSvg>
  );
}

export function ClockIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={24} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </StrokeSvg>
  );
}

export function ChevronRightIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={16} strokeWidth={2} {...props}>
      <path d="M9 6l6 6-6 6" />
    </StrokeSvg>
  );
}

export function ChevronLeftIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={24} strokeWidth={2} {...props}>
      <path d="M15 6l-6 6 6 6" />
    </StrokeSvg>
  );
}

export function GlassIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={14} {...props}>
      <path d="M5 4h14l-7 9z" />
      <path d="M12 13v7" />
      <path d="M8 20h8" />
    </StrokeSvg>
  );
}

export function FilterIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={22} {...props}>
      <path d="M3 5h18l-7 9v6l-4-2v-4z" />
    </StrokeSvg>
  );
}

export function FilterFilledIcon(props: IconComponentProps) {
  return (
    <FillSvg defaultSize={22} {...props}>
      <path d="M3 5h18l-7 9v6l-4-2v-4z" />
    </FillSvg>
  );
}

export function ThumbUpIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={22} {...props}>
      <path d="M2 10h4v12H2zM6 11l4-7a2 2 0 013.5 1.5L13 10h6.5a2 2 0 012 2.4l-1.4 7a2 2 0 01-2 1.6H6" />
    </StrokeSvg>
  );
}

export function ThumbUpFilledIcon(props: IconComponentProps) {
  return (
    <FillSvg defaultSize={22} {...props}>
      <path d="M2 10h4v12H2zM22 11a2 2 0 00-2-2h-5.5l1-4.5a1.5 1.5 0 00-3-.5L8 10v12h11a2 2 0 002-1.5l1-7a2 2 0 000-2.5z" />
    </FillSvg>
  );
}

export function ThumbDownIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={22} {...props}>
      <path d="M22 14h-4V2h4zM18 13l-4 7a2 2 0 01-3.5-1.5L11 14H4.5a2 2 0 01-2-2.4l1.4-7a2 2 0 012-1.6H18" />
    </StrokeSvg>
  );
}

export function ThumbDownFilledIcon(props: IconComponentProps) {
  return (
    <FillSvg defaultSize={22} {...props}>
      <path d="M22 14h-4V2h4zM2 13a2 2 0 002 2h5.5l-1 4.5a1.5 1.5 0 003 .5L16 14V2H5a2 2 0 00-2 1.5l-1 7a2 2 0 000 2.5z" />
    </FillSvg>
  );
}

export function StarIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={22} {...props}>
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
    </StrokeSvg>
  );
}

export function StarFilledIcon(props: IconComponentProps) {
  return (
    <FillSvg defaultSize={22} {...props}>
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
    </FillSvg>
  );
}

export function ShareIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={22} {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </StrokeSvg>
  );
}

export function HeartIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={16} {...props}>
      <path d="M12 21s-8-5-8-12a5 5 0 019-3 5 5 0 019 3c0 7-8 12-8 12z" />
    </StrokeSvg>
  );
}

export function HeartFilledIcon(props: IconComponentProps) {
  return (
    <FillSvg defaultSize={16} {...props}>
      <path d="M12 21s-8-5-8-12a5 5 0 019-3 5 5 0 019 3c0 7-8 12-8 12z" />
    </FillSvg>
  );
}

export function EyeIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={24} {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </StrokeSvg>
  );
}

export function EyeOffIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={24} {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A11 11 0 0112 5c7 0 10 7 10 7a17.6 17.6 0 01-3.2 4" />
      <path d="M6.3 6.3A17 17 0 002 12s3 7 10 7a11 11 0 005-1.2" />
      <circle cx="12" cy="12" r="3" />
    </StrokeSvg>
  );
}

export function CloseIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={14} strokeWidth={1.8} {...props}>
      <path d="M5 5l14 14M19 5l-14 14" />
    </StrokeSvg>
  );
}

export function ArrowUpRightIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={18} {...props}>
      <path d="M7 17L17 7M8 7h9v9" />
    </StrokeSvg>
  );
}

export function SettingsIcon(props: IconComponentProps) {
  return (
    <FillSvg defaultSize={20} viewBox="0 0 20 20" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.2 11c0-.3.1-.7.1-1s0-.7-.1-1l2.1-1.6c.2-.2.2-.4.1-.6l-2-3.5c-.1-.2-.4-.3-.6-.2l-2.5 1c-.5-.4-1.1-.7-1.7-1L12.2.4c0-.2-.2-.4-.5-.4H7.7c-.2 0-.5.2-.5.4L6.9 3.1c-.6.2-1.2.6-1.7 1l-2.5-1c-.2-.1-.5 0-.6.2l-2 3.5c-.1.2-.1.5.1.6L2.3 9c0 .3-.1.7-.1 1s0 .3.1 1L.2 12.6c-.2.2-.2.4-.1.6l2 3.5c.1.2.4.3.6.2l2.5-1c.5.4 1.1.7 1.7 1l.4 2.6c0 .2.2.4.5.4h4c.2 0 .5-.2.5-.4l.4-2.6c.6-.2 1.2-.6 1.7-1l2.5 1c.2.1.5 0 .6-.2l2-3.5c.1-.2.1-.5-.1-.6L17.2 11zM9.7 13.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"
      />
    </FillSvg>
  );
}

export function PlayIcon(props: IconComponentProps) {
  return (
    <FillSvg defaultSize={14} {...props}>
      <path d="M6 4l14 8-14 8z" />
    </FillSvg>
  );
}

export function TabHomeIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={24} strokeWidth={1.5} {...props}>
      <path d="M3 11l9-8 9 8M5 9.5V20h5v-6h4v6h5V9.5" />
    </StrokeSvg>
  );
}

export function TabHomeFilledIcon(props: IconComponentProps) {
  return (
    <FillSvg defaultSize={24} {...props}>
      <path d="M12 3l9 8h-2v9h-5v-6h-4v6H5v-9H3z" />
    </FillSvg>
  );
}

export function TabExploreIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={24} strokeWidth={1.5} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8l-2 6-6 2 2-6z" />
    </StrokeSvg>
  );
}

export function TabExploreFilledIcon({
  size,
  className,
  ...rest
}: IconComponentProps) {
  const isLabelled = Boolean(rest["aria-label"]);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? 24}
      height={size ?? 24}
      viewBox="0 0 24 24"
      fill="currentColor"
      role={isLabelled ? "img" : undefined}
      aria-hidden={rest["aria-hidden"] ?? (isLabelled ? undefined : true)}
      aria-label={rest["aria-label"]}
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      {/* Needle is a cutout in the Figma source. Use the page bg token so the
          cutout effect works in both light and dark themes (Figma hardcodes #fff). */}
      <path d="M16 8l-2 6-6 2 2-6z" style={{ fill: "var(--color-bg)" }} />
    </svg>
  );
}

export function TabCocktailIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={24} strokeWidth={1.5} {...props}>
      <path d="M3 4h18l-9 11zM12 15v5M8 20h8" />
    </StrokeSvg>
  );
}

// Filled variant: single-path cup (closed subpath fills) + same path stroked so stem & base are visible
export function TabCocktailFilledIcon({
  size,
  className,
  ...rest
}: IconComponentProps) {
  const isLabelled = Boolean(rest["aria-label"]);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? 24}
      height={size ?? 24}
      viewBox="0 0 24 24"
      fill="currentColor"
      role={isLabelled ? "img" : undefined}
      aria-hidden={rest["aria-hidden"] ?? (isLabelled ? undefined : true)}
      aria-label={rest["aria-label"]}
      className={className}
    >
      <path d="M3 4h18l-9 11zM12 15v5M8 20h8" />
      <path
        d="M3 4h18l-9 11zM12 15v5M8 20h8"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function TabMyIcon(props: IconComponentProps) {
  return (
    <StrokeSvg defaultSize={24} strokeWidth={1.5} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7" />
    </StrokeSvg>
  );
}

export function TabMyFilledIcon(props: IconComponentProps) {
  return (
    <FillSvg defaultSize={24} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7" />
    </FillSvg>
  );
}
