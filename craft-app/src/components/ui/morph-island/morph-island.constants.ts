import type { MorphIslandState } from './morph-island.types'

// px. width and height spring separately, so every change lands sideways first
export const SIZES: Record<MorphIslandState, { width: number; height: number }> = {
  idle: { width: 126, height: 36 },
  timer: { width: 230, height: 36 },
  upload: { width: 290, height: 56 },
  call: { width: 340, height: 84 },
}

// the content row is a little narrower than its island so it keeps a margin
export const CONTENT_WIDTHS = { timer: 206, upload: 262, call: 312 } as const

// tapping the island steps to the next, richer activity, then back to idle
export const NEXT_STATE: Record<MorphIslandState, MorphIslandState> = {
  idle: 'timer',
  timer: 'upload',
  upload: 'call',
  call: 'idle',
}

// --island-w: width morph
export const WIDTH_SPRING = { type: 'spring', stiffness: 380, damping: 24, mass: 1 } as const
// --island-h: height morph, a bit softer so it lands after the width
export const HEIGHT_SPRING = { type: 'spring', stiffness: 300, damping: 22, mass: 1 } as const
// when it shrinks the height gets 1.3x the stiffness, so it tucks in before the width
export const SHRINK_STIFFNESS = 1.3
// no token, set inline in the source: the press dip, and the bump on every morph
export const PRESS_SPRING = { type: 'spring', stiffness: 520, damping: 18, mass: 1 } as const
export const PRESSED_SCALE = 0.96
// downward kicks on the press spring, in scale per second. growing kicks harder
export const GROW_KICK = 1.6
export const SHRINK_KICK = 1

// --island-radius: the corners stop rounding at this once it is tall
export const MAX_RADIUS = 32
export const MIN_HEIGHT = 20
// volume: while the height moves fast the width gives back up to 5%
export const GIVE = 0.05
export const GIVE_VELOCITY = 7000

// css `ease`, and the long ease-out the content settles on
const EASE = [0.25, 0.1, 0.25, 1] as const
const EASE_OUT = [0.16, 1, 0.3, 1] as const

// new content waits 90ms so the shape is already moving when it fades in
export const CONTENT_IN = {
  opacity: { duration: 0.35, ease: EASE, delay: 0.09 },
  filter: { duration: 0.35, ease: EASE, delay: 0.09 },
  scale: { duration: 0.6, ease: EASE_OUT, delay: 0.09 },
} as const
export const CONTENT_OUT = {
  opacity: { duration: 0.14, ease: EASE },
  filter: { duration: 0.14, ease: EASE },
  scale: { duration: 0.2, ease: EASE },
} as const
export const CONTENT_BLUR = 'blur(6px)'
export const CONTENT_SCALE = 0.9

// 04:59, like the source
export const TIMER_SECONDS = 299
export const UPLOAD_SECONDS = 2.4
// circumference of the r=13 ring
export const RING_LENGTH = 81.7

// status colours with no theme token, so they stay fixed: light first, then dark
export const TIMER_COLOR = 'text-[#c2660a] dark:text-[#ff9f0a]'
export const UPLOAD_TEXT_COLOR = 'text-[#15803d] dark:text-[#34d17a]'
export const UPLOAD_RING_COLOR = 'stroke-[#34d17a]'
export const ACCEPT_COLOR = 'bg-[#34d17a] text-black'

// the default caller is a glowing green orb, lit from the top left
export const ORB_BACKGROUND = [
  'radial-gradient(55% 55% at 30% 22%, rgba(255,255,255,.42) 0, rgba(255,255,255,0) 70%)',
  'radial-gradient(110% 80% at 50% 118%, rgba(0,0,0,.16) 0, rgba(0,0,0,0) 60%)',
  'radial-gradient(95% 95% at 82% 88%, #16c7a4 8%, transparent 78%)',
  '#a6f24a',
].join(', ')
