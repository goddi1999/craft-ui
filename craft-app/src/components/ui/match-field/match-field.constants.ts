// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
/** Fixed drawing space; the SVG scales to its container. */
export const W = 440
export const H = 380
export const CX = W / 2
export const CY = H / 2
/** Outer radius of the field. */
export const R = 150
/** Radius of the empty centre that holds the icon. */
export const INNER = 26
export const DOT_STEP = 7.5

// Avatar colours: teal, purple, gold, blue, green. Literal values so they read
// on both themes without needing a brand token.
export const PALETTE = [
  'oklch(0.62 0.19 255)',
  'oklch(0.65 0.11 185)',
  'oklch(0.62 0.21 315)',
  'oklch(0.66 0.12 85)',
  'oklch(0.68 0.15 150)',
]

/** Shared motion values (strong ease-out; exits faster than entrances). */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const enter = { duration: 0.2, ease: EASE_OUT } as const
export const exit = { duration: 0.14, ease: EASE_OUT } as const
/** Instant transition for keyboard-initiated changes. */
export const instant = { duration: 0 } as const
