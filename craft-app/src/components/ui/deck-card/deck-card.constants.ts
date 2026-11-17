import { cn } from "@/lib/utils";

/** Deck palette, inlined as oklch so the component needs no theme variables. */
export const DECK_COLORS = {
  black: { label: "Black", value: "0 0 0" },
  violet: { label: "Violet", value: "0.76 0.18 305" },
  indigo: { label: "Indigo", value: "0.74 0.15 275" },
  blue: { label: "Blue", value: "0.78 0.14 245" },
  cyan: { label: "Cyan", value: "0.8 0.13 215" },
  teal: { label: "Teal", value: "0.78 0.14 185" },
  green: { label: "Green", value: "0.8 0.16 150" },
  lime: { label: "Lime", value: "0.84 0.18 125" },
  orange: { label: "Orange", value: "0.82 0.17 55" },
  pink: { label: "Pink", value: "0.8 0.17 10" },
  darkblue: { label: "Dark Blue", value: "0.45 0.14 254" },
  magenta: { label: "Magenta", value: "0.72 0.22 336" },
  red: { label: "Red", value: "0.63 0.24 27" },
  "deep-cyan": { label: "Deep Cyan", value: "0.52 0.1 200" },
  yellow: { label: "Yellow", value: "0.85 0.19 95" },
} as const;

export const DECK_COLOR_IDS = [
  "black",
  "violet",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "green",
  "lime",
  "orange",
  "pink",
  "darkblue",
  "magenta",
  "red",
  "deep-cyan",
  "yellow",
] as const satisfies readonly (keyof typeof DECK_COLORS)[];

export const DEFAULT_DECK_COLOR = "lime" satisfies keyof typeof DECK_COLORS;

export const MENU_ITEM_CLASS_NAME = cn(
  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
  "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
  "disabled:pointer-events-none disabled:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
);
