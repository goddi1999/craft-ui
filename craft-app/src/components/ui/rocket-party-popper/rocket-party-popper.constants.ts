import type { TargetAndTransition, Transition } from 'motion/react'

// easyui motion tokens, inlined so the folder copies on its own
export const SPRING_GENTLE: Transition = { type: 'spring', stiffness: 170, damping: 26, mass: 0.9 }
export const FADE: Transition = { duration: 0.2 }

// the rocket is out of sight just before the confetti bursts
export const LAUNCH_MS = 600
// where the burst starts, measured down from the top of the canvas
export const BURST_Y = 60

export const LIFT_OFF: TargetAndTransition = {
  y: [-2, -170],
  scale: [1, 1.1],
  opacity: [1, 1, 0.8, 0],
  transition: { duration: 0.58, ease: [0.4, 0, 0.2, 1] },
}
export const HOVER: TargetAndTransition = {
  y: [0, -2.5, 0],
  transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
}
// the pilot light flickers while it waits, then flares on lift-off
export const FLICKER: TargetAndTransition = {
  scaleY: [0.8, 1.2, 0.8],
  opacity: [0.4, 0.7, 0.4],
  transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
}
export const THRUST: TargetAndTransition = {
  scale: [1, 1.3, 1.1],
  opacity: [0.9, 1, 0],
  transition: { duration: 0.5 },
}

// the two neutrals take the text colour, so they show on light and dark
export const CONFETTI_COLORS = [
  'currentColor',
  '#38BDF8',
  '#34D399',
  '#FBBF24',
  '#F472B6',
  '#A78BFA',
  'currentColor',
]

// physics per 60 fps frame
export const GRAVITY = 0.2
export const DRAG = 0.985
export const FRAME_MS = 1000 / 60
// a long frame steps at most this many frames, so a hitch does not fling the confetti
export const MAX_STEP = 3
// a fan opening upward, a bit wider than a right angle on each side
export const SPREAD = Math.PI * 1.3
export const LIFT = 2.2
// pieces fade out over the last quarter of their life
export const FADE_FROM = 0.75

export const FOCUS_RING = 'outline-none focus-visible:ring-2 focus-visible:ring-ring'
