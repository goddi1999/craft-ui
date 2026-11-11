export const SURFACE = 'bg-muted text-muted-foreground'

// iOS system colours, light and dark
export const BADGE_COLORS = {
  red: 'bg-[#FF3B30] dark:bg-[#FF453A]',
  orange: 'bg-[#FF9500] dark:bg-[#FF9F0A]',
  green: 'bg-[#34C759] dark:bg-[#30D158]',
  blue: 'bg-[#007AFF] dark:bg-[#0A84FF]',
  violet: 'bg-[#AF52DE] dark:bg-[#BF5AF2]',
} as const

// all sizes are a fraction of the size prop
export const ICON = 0.56
export const BADGE = 0.38
export const DOT = 0.22
export const FONT = 0.21
export const PAD = 0.09
// how far out the badge sits, 1 puts it right on the edge
export const ORBIT = 0.9

// low damping so it keeps swinging for a bit
export const SWING_SPRING = {
  type: 'spring',
  stiffness: 220,
  damping: 10,
  mass: 1,
  restDelta: 0.01,
} as const
export const CLAPPER_SPRING = { stiffness: 300, damping: 14, mass: 1 }
export const COLUMN_SPRING = { stiffness: 400, damping: 30, mass: 0.9 }
export const ENTER_SPRING = { type: 'spring', stiffness: 600, damping: 20 } as const
export const FADE = { duration: 0.15 } as const

// degrees per second
export const IMPULSE = 500
export const MAX_VELOCITY = 900
export const BURST = 5
export const CLAPPER_SWEEP = 13
export const CLAPPER_VELOCITY = 450

// how many digits to keep above and below, and how far behind the spring can get
export const WINDOW = 3
export const LAG = 2

// a taller window would show the next digit at rest, so the fade rides velocity instead
export const ROLL_FADE = 34
export const ROLL_VELOCITY = 9
