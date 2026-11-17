/** Width lands first (stiffer); height follows — same idea as morph-island. */
export const DOCK_WIDTH_SPRING = {
  type: 'spring',
  stiffness: 380,
  damping: 24,
  mass: 1,
} as const

export const DOCK_HEIGHT_SPRING = {
  type: 'spring',
  stiffness: 300,
  damping: 22,
  mass: 1,
} as const

/** Shrink tucks height in before width finishes. */
export const DOCK_SHRINK_STIFFNESS = 1.3

export const DOCK_MAX_RADIUS = 999
export const DOCK_MIN_HEIGHT = 40

/** Width gives up to 5% while height is moving fast. */
export const DOCK_GIVE = 0.05
export const DOCK_GIVE_VELOCITY = 7000

const EASE = [0.25, 0.1, 0.25, 1] as const
const EASE_OUT = [0.16, 1, 0.3, 1] as const

/** New label waits so the pill is already resizing when it fades in. */
export const DOCK_LABEL_IN = {
  opacity: { duration: 0.35, ease: EASE, delay: 0.09 },
  filter: { duration: 0.35, ease: EASE, delay: 0.09 },
  scale: { duration: 0.6, ease: EASE_OUT, delay: 0.09 },
} as const

export const DOCK_LABEL_OUT = {
  opacity: { duration: 0.14, ease: EASE },
  filter: { duration: 0.14, ease: EASE },
  scale: { duration: 0.2, ease: EASE },
} as const

export const DOCK_LABEL_BLUR = 'blur(6px)'
export const DOCK_LABEL_SCALE = 0.96
