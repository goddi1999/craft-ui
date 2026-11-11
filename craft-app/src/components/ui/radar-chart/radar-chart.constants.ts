// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
/** Gap between the polygon edge and its axis label. */
export const GAP = 12
/** Line height of an axis label. */
export const LINE = 16
export const PAD = 6
export const MAX_R = 124
export const MIN_R = 32
export const TIP = 196
/** Labels wrap by word once they pass this width, in px. */
export const WRAP = 84

/** Default series colour. */
export const SERIES_COLOR = 'var(--primary)'

// Member dots: blue, teal, purple, gold. Literal values so they read on both
// themes without needing a brand token.
export const PALETTE = [
  'oklch(0.62 0.19 255)',
  'oklch(0.65 0.11 185)',
  'oklch(0.62 0.21 315)',
  'oklch(0.66 0.12 85)',
]

/** Shared motion values (strong ease-out; exits faster than entrances). */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const enter = { duration: 0.2, ease: EASE_OUT } as const
export const exit = { duration: 0.14, ease: EASE_OUT } as const
