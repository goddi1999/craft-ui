import type { TargetAndTransition } from 'motion/react'

/** Every stroke starts undrawn and invisible... */
export const INITIAL_PROPS: TargetAndTransition = {
  pathLength: 0,
  opacity: 0,
}

/** ...and ends fully drawn and opaque. */
export const ANIMATE_PROPS: TargetAndTransition = {
  pathLength: 1,
  opacity: 1,
}

/** Fade the whole svg in/out when mounted under AnimatePresence. */
export const SVG_MOTION_PROPS = {
  initial: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
} as const

/** Builds the function that scales a duration or delay by `durationScale`. */
export const createScale = (durationScale: number) => (seconds: number) =>
  seconds * durationScale
