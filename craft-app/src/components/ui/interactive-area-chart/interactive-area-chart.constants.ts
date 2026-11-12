// every series is resampled to this many points, so ranges morph point for point
export const SAMPLES = 72
export const PAD = { top: 48, right: 12, bottom: 28, left: 48 } as const
export const TIP_WIDTH = 124

// below these widths the axes get fewer, shorter labels
export const NARROW = 380
export const MEDIUM = 520

export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

export const REVEAL = { duration: 1.1, ease: EASE_IN_OUT } as const
export const MORPH = { duration: 0.55, ease: EASE_IN_OUT } as const
export const GRID_FADE = { duration: 0.2, ease: EASE_OUT } as const
export const FADE = { duration: 0.15, ease: EASE_OUT } as const
export const PILL_SPRING = { type: 'spring', duration: 0.3, bounce: 0.15 } as const
export const SCRUB_SPRING = { stiffness: 520, damping: 42, mass: 0.6 }
export const INSTANT = { duration: 0 } as const

// the demo data is daily and ends on this day
export const DAY = 86_400_000
export const END_DATE = Date.UTC(2026, 9, 13)
