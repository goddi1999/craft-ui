// the theme's accent tokens (`--oklch-*` in index.css); the streak takes one as its colour
export const STREAK_COLORS = [
  "pink",
  "orange",
  "violet",
  "blue",
  "green",
  "teal",
] as const;

export const DEFAULT_WEEKDAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

// strong ease-out: the bar lands quickly instead of crawling to its value
export const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
export const BAR_MS = 600;
