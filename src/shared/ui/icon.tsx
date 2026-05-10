import type { SVGProps } from "react";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

interface FillableIconProps extends IconProps {
  filled?: boolean;
}

const stroke = (props: IconProps) => ({
  width: props.size ?? 24,
  height: props.size ?? 24,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: props.color ?? "currentColor",
  strokeWidth: props.strokeWidth ?? 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

const fill = (props: IconProps) => ({
  width: props.size ?? 24,
  height: props.size ?? 24,
  viewBox: "0 0 24 24",
  fill: props.color ?? "currentColor",
});

const Bell = (props: IconProps) => (
  <svg {...stroke(props)}>
    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 01-3.4 0" />
  </svg>
);

const Search = (props: IconProps) => (
  <svg {...stroke(props)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const ChevronRight = (props: IconProps) => (
  <svg {...stroke({ ...props, strokeWidth: props.strokeWidth ?? 2, size: props.size ?? 16 })}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

const ChevronLeft = (props: IconProps) => (
  <svg {...stroke({ ...props, strokeWidth: props.strokeWidth ?? 2 })}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

const Eye = (props: IconProps) => (
  <svg {...stroke({ ...props, size: props.size ?? 14 })}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const Glass = (props: IconProps) => (
  <svg {...stroke({ ...props, size: props.size ?? 14 })}>
    <path d="M5 4h14l-7 9z" />
    <path d="M12 13v7" />
    <path d="M8 20h8" />
  </svg>
);

const Filter = (props: IconProps) => (
  <svg {...stroke({ ...props, size: props.size ?? 22 })}>
    <path d="M3 5h18l-7 9v6l-4-2v-4z" />
  </svg>
);

const Heart = ({ filled, ...props }: FillableIconProps) =>
  filled ? (
    <svg {...fill({ ...props, size: props.size ?? 16 })}>
      <path d="M12 21s-8-5-8-12a5 5 0 019-3 5 5 0 019 3c0 7-8 12-8 12z" />
    </svg>
  ) : (
    <svg {...stroke({ ...props, size: props.size ?? 16 })}>
      <path d="M12 21s-8-5-8-12a5 5 0 019-3 5 5 0 019 3c0 7-8 12-8 12z" />
    </svg>
  );

const Share = (props: IconProps) => (
  <svg {...stroke({ ...props, size: props.size ?? 22 })}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </svg>
);

const Close = (props: IconProps) => (
  <svg {...stroke({ ...props, size: props.size ?? 14, strokeWidth: 1.8 })}>
    <path d="M5 5l14 14M19 5l-14 14" />
  </svg>
);

const ArrowUpRight = (props: IconProps) => (
  <svg {...stroke({ ...props, size: props.size ?? 18 })}>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

const Settings = (props: IconProps) => (
  <svg {...stroke(props)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1.5l1.6 2.4 2.8-.6.6 2.8 2.8.6-.6 2.8 2.4 1.6-2.4 1.6.6 2.8-2.8.6-.6 2.8-2.8-.6L12 22.5l-1.6-2.4-2.8.6-.6-2.8-2.8-.6.6-2.8L2.4 12.6 4.8 11l-.6-2.8 2.8-.6.6-2.8 2.8.6z" />
  </svg>
);

const Play = (props: IconProps) => (
  <svg {...fill({ ...props, size: props.size ?? 14 })}>
    <path d="M6 4l14 8-14 8z" />
  </svg>
);

const Star = ({ filled, ...props }: FillableIconProps) =>
  filled ? (
    <svg {...fill({ ...props, size: props.size ?? 22 })}>
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
    </svg>
  ) : (
    <svg {...stroke({ ...props, size: props.size ?? 22 })}>
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
    </svg>
  );

const TabHome = ({ filled, ...props }: FillableIconProps) =>
  filled ? (
    <svg {...fill(props)}>
      <path d="M12 3l9 8h-2v9h-5v-6h-4v6H5v-9H3z" />
    </svg>
  ) : (
    <svg {...stroke({ ...props, strokeWidth: 1.5 })}>
      <path d="M3 11l9-8 9 8M5 9.5V20h5v-6h4v6h5V9.5" />
    </svg>
  );

const TabExplore = ({ filled, ...props }: FillableIconProps) =>
  filled ? (
    <svg {...fill(props)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8l-2 6-6 2 2-6z" fill="#fff" />
    </svg>
  ) : (
    <svg {...stroke({ ...props, strokeWidth: 1.5 })}>
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8l-2 6-6 2 2-6z" />
    </svg>
  );

const TabCocktail = ({ filled, ...props }: FillableIconProps) =>
  filled ? (
    <svg {...stroke({ ...props, strokeWidth: 1.6 })}>
      <path d="M3 4h18l-9 11zM12 15v5M8 20h8" fill={props.color ?? "currentColor"} />
    </svg>
  ) : (
    <svg {...stroke({ ...props, strokeWidth: 1.5 })}>
      <path d="M3 4h18l-9 11zM12 15v5M8 20h8" />
    </svg>
  );

const TabMy = ({ filled, ...props }: FillableIconProps) =>
  filled ? (
    <svg {...fill(props)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7" />
    </svg>
  ) : (
    <svg {...stroke({ ...props, strokeWidth: 1.5 })}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7" />
    </svg>
  );

export const Icon = {
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Glass,
  Filter,
  Heart,
  Share,
  Close,
  ArrowUpRight,
  Settings,
  Play,
  Star,
  TabHome,
  TabExplore,
  TabCocktail,
  TabMy,
};

export type IconName = keyof typeof Icon;
