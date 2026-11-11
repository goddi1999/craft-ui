import type { Transition } from 'motion/react'

// the same strong curves the rest of the library uses for enters and exits
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

/** Rare and explanatory, so these may run longer than a UI animation. */
export const CLOUD_MS = 1100
export const COLLAPSE_MS = 700

/** Orbit radii and chip sizes, in container-width units (cqw). */
export const RADIUS_X = 35
export const RADIUS_Y = 31
export const AVATAR_SIZE = 42
export const CHIP_SIZE = 20

// the first chip appears 40ms after the avatar, then each follows 40ms later
export const ENTER_STAGGER = 0.04
export const EXIT_STAGGER = 0.015

export const SWAP_SPRING: Transition = { type: 'spring', duration: 0.9, bounce: 0.12 }
// a little overshoot as each chip lands, for a playful, rarely-seen explainer
export const ENTER_SPRING: Transition = { type: 'spring', duration: 0.7, bounce: 0.3 }
// asymmetric: slow while the scene is introduced, quick when it hands back to the cloud
export const EXIT_SPRING: Transition = { type: 'spring', duration: 0.32, bounce: 0 }

/** Each chip sits a little off the perfect ring, so the cluster looks placed by hand. */
export const JITTER_RADIUS = 0.14
export const JITTER_ANGLE = 0.24

/** Idle float: a small drift per chip, each on its own period and phase. */
export const FLOAT_AMPLITUDE = 1.1
export const FLOAT_PERIOD = 3.4
