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
        d="M17.1593 10.98C17.1993 10.66 17.2293 10.34 17.2293 10C17.2293 9.66 17.1993 9.34 17.1593 9.02L19.2693 7.37C19.4593 7.22 19.5093 6.95 19.3893 6.73L17.3893 3.27C17.2693 3.05 16.9993 2.97 16.7793 3.05L14.2893 4.05C13.7693 3.65 13.2093 3.32 12.5993 3.07L12.2193 0.42C12.1893 0.18 11.9793 0 11.7293 0H7.72933C7.47933 0 7.26933 0.18 7.23933 0.42L6.85933 3.07C6.24933 3.32 5.68933 3.66 5.16933 4.05L2.67933 3.05C2.44933 2.96 2.18933 3.05 2.06933 3.27L0.0693316 6.73C-0.0606684 6.95 -0.000668302 7.22 0.189332 7.37L2.29933 9.02C2.25933 9.34 2.22933 9.67 2.22933 10C2.22933 10.33 2.25933 10.66 2.29933 10.98L0.189332 12.63C-0.000668302 12.78 -0.0506684 13.05 0.0693316 13.27L2.06933 16.73C2.18933 16.95 2.45933 17.03 2.67933 16.95L5.16933 15.95C5.68933 16.35 6.24933 16.68 6.85933 16.93L7.23933 19.58C7.26933 19.82 7.47933 20 7.72933 20H11.7293C11.9793 20 12.1893 19.82 12.2193 19.58L12.5993 16.93C13.2093 16.68 13.7693 16.34 14.2893 15.95L16.7793 16.95C17.0093 17.04 17.2693 16.95 17.3893 16.73L19.3893 13.27C19.5093 13.05 19.4593 12.78 19.2693 12.63L17.1593 10.98ZM9.72933 13.5C7.79933 13.5 6.22933 11.93 6.22933 10C6.22933 8.07 7.79933 6.5 9.72933 6.5C11.6593 6.5 13.2293 8.07 13.2293 10C13.2293 11.93 11.6593 13.5 9.72933 13.5Z"
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
