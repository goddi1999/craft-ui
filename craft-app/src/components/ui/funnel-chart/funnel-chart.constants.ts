/** Vertical rhythm: label row, bar, and the bridge between stages. */
export const LAYOUT = { text: 22, bar: 30, bridge: 30 } as const

/** Minimum bar width so a near-zero stage still reads as a chip. */
export const MIN_BAR = 28

/** Fallback width until ResizeObserver measures the container. */
export const FALLBACK_WIDTH = 480

/** Below this, stage rows hide the “· pct” suffix so values stay fully readable. */
export const SHOW_PCT_AT = 360

export const TIP_WIDTH = 196

/** Default ends of the stage colour ramp (oklch so both themes stay legible). */
export const RAMP = {
  from: 'oklch(0.62 0.19 255)',
  to: 'oklch(0.72 0.12 185)',
} as const

export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const BAR_SPRING = { type: 'spring', duration: 0.9, bounce: 0.12 } as const
export const BRIDGE_SPRING = { type: 'spring', duration: 0.7, bounce: 0.1 } as const
export const FADE = { duration: 0.2, ease: EASE_OUT } as const
export const INSTANT = { duration: 0 } as const
