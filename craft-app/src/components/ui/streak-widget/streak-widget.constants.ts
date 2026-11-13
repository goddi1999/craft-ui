// the theme's accent tokens (`--oklch-*` in index.css); the streak takes one as its colour
export const STREAK_COLORS = ['pink', 'orange', 'violet', 'blue', 'green', 'teal'] as const

export const DEFAULT_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

// strong ease-out: the bar lands quickly instead of crawling to its value
export const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'
export const BAR_MS = 600

export const STREAK_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

// per size: tile padding, flame, day count and label; embers only where there is room for them
export const SIZE = {
  xs: {
    tile: 'gap-0.5 px-3 py-3',
    flame: 'size-10',
    count: 'text-xl',
    label: 'text-[11px]',
    embers: false,
  },
  sm: {
    tile: 'gap-0.5 px-4 py-4',
    flame: 'size-14',
    count: 'text-2xl',
    label: 'text-xs',
    embers: false,
  },
  md: {
    tile: 'gap-1 px-6 py-5',
    flame: 'size-20',
    count: 'text-3xl',
    label: 'text-sm',
    embers: true,
  },
  lg: {
    tile: 'gap-1.5 px-8 py-7',
    flame: 'size-28',
    count: 'text-5xl',
    label: 'text-base',
    embers: true,
  },
  xl: {
    tile: 'gap-2 px-10 py-9',
    flame: 'size-36',
    count: 'text-6xl',
    label: 'text-lg',
    embers: true,
  },
} as const

// embers drifting up off the flame: position over the flame box in %, size in % of the flame, delay in s
export const EMBERS = [
  { left: 8, top: 4, size: 9, delay: 0 },
  { left: 70, top: -6, size: 7, delay: 0.9 },
  { left: 92, top: 26, size: 6, delay: 1.6 },
] as const
