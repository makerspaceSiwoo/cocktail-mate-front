import * as React from "react";
import {
  ArrowUpRightIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
  FilterFilledIcon,
  FilterIcon,
  GlassIcon,
  HeartFilledIcon,
  HeartIcon,
  type IconComponentProps,
  PlayIcon,
  SearchFilledIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  StarFilledIcon,
  StarIcon,
  TabCocktailFilledIcon,
  TabCocktailIcon,
  TabExploreFilledIcon,
  TabExploreIcon,
  TabHomeFilledIcon,
  TabHomeIcon,
  TabMyFilledIcon,
  TabMyIcon,
  ThumbDownFilledIcon,
  ThumbDownIcon,
  ThumbUpFilledIcon,
  ThumbUpIcon,
} from "./icons";

export type IconName =
  | "ArrowUpRight"
  | "Bell"
  | "ChevronLeft"
  | "ChevronRight"
  | "Close"
  | "Eye"
  | "EyeOff"
  | "Filter"
  | "Filter-filled"
  | "Glass"
  | "Heart"
  | "Heart-filled"
  | "Play"
  | "Search"
  | "Search-filled"
  | "Settings"
  | "Share"
  | "Star"
  | "Star-filled"
  | "TabCocktail"
  | "TabCocktail-filled"
  | "TabExplore"
  | "TabExplore-filled"
  | "TabHome"
  | "TabHome-filled"
  | "TabMy"
  | "TabMy-filled"
  | "ThumbDown"
  | "ThumbDown-filled"
  | "ThumbUp"
  | "ThumbUp-filled";

export interface IconProps extends IconComponentProps {
  name: IconName;
}

const REGISTRY: Record<IconName, React.ComponentType<IconComponentProps>> = {
  ArrowUpRight: ArrowUpRightIcon,
  Bell: BellIcon,
  ChevronLeft: ChevronLeftIcon,
  ChevronRight: ChevronRightIcon,
  Close: CloseIcon,
  Eye: EyeIcon,
  EyeOff: EyeOffIcon,
  Filter: FilterIcon,
  "Filter-filled": FilterFilledIcon,
  Glass: GlassIcon,
  Heart: HeartIcon,
  "Heart-filled": HeartFilledIcon,
  Play: PlayIcon,
  Search: SearchIcon,
  "Search-filled": SearchFilledIcon,
  Settings: SettingsIcon,
  Share: ShareIcon,
  Star: StarIcon,
  "Star-filled": StarFilledIcon,
  TabCocktail: TabCocktailIcon,
  "TabCocktail-filled": TabCocktailFilledIcon,
  TabExplore: TabExploreIcon,
  "TabExplore-filled": TabExploreFilledIcon,
  TabHome: TabHomeIcon,
  "TabHome-filled": TabHomeFilledIcon,
  TabMy: TabMyIcon,
  "TabMy-filled": TabMyFilledIcon,
  ThumbDown: ThumbDownIcon,
  "ThumbDown-filled": ThumbDownFilledIcon,
  ThumbUp: ThumbUpIcon,
  "ThumbUp-filled": ThumbUpFilledIcon,
};

export const ICON_NAMES: readonly IconName[] = Object.keys(
  REGISTRY,
) as IconName[];

export function Icon({ name, ...props }: IconProps) {
  const Component = REGISTRY[name];
  return <Component {...props} />;
}
