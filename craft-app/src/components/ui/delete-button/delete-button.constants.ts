import type { Variants } from 'motion/react'

// the lid swings about its left end, where it meets the bin wall
export const HINGE = '3px 6px'
export const LID_OPEN = -35
export const WALL_TOP = 6
export const WALL_TOP_OPEN = 13.5
export const WALL_BASE = 20

export const TILE = 48
export const PANEL = 84
// how long the check, or the settled bin, holds before the button goes back to idle
export const HOLD = { deleted: 1400, kept: 600 } as const

const EASE = [0.32, 0.72, 0, 1] as const
const EASE_LID = [0.34, 1.1, 0.64, 1] as const

export const WIDTH = { duration: 0.62, ease: EASE } as const
export const LID = { duration: 0.6, ease: EASE_LID } as const
export const WALL = { duration: 0.56, ease: EASE } as const
const IN = { duration: 0.44, ease: EASE, delay: 0.14 } as const
const OUT = { duration: 0.3, ease: EASE } as const
export const TAP = { duration: 0.2, ease: EASE } as const
export const SWAP = { duration: 0.22, ease: EASE } as const
export const SETTLE = { duration: 0.45, ease: EASE } as const
export const PRESS = { type: 'spring', stiffness: 520, damping: 18, mass: 0.5 } as const
export const INSTANT = { duration: 0 } as const

export const DEFAULT_ACCENT = '#FF5F2E'

// the panel is a shade darker than the tile it slides out of, in both themes
export const RECESS = 'bg-black/[0.06] dark:bg-black/25'
export const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-ring'

const LIFT =
  'shadow-[0_0.5px_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.08),inset_0_0.5px_0_rgba(255,255,255,0.9)] dark:shadow-[0_0.5px_1px_rgba(0,0,0,0.35),0_1.5px_4px_rgba(0,0,0,0.25),inset_0_0.5px_0_rgba(255,255,255,0.07)]'

export const CIRCLE = `grid size-7 place-items-center rounded-full bg-muted transition-colors duration-200 hover:bg-background dark:hover:bg-[color-mix(in_oklab,var(--muted),white_4%)] ${FOCUS} ${LIFT}`

export const ICON = {
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

export const CHECK_PATH = 'M4 12.5 9.5 18 20 7'

export const panelMotion: Variants = {
  hidden: { opacity: 0, x: -6, transition: OUT },
  shown: { opacity: 1, x: 0, transition: { ...IN, staggerChildren: 0.07 } },
}

export const circleMotion: Variants = {
  hidden: { opacity: 0, scale: 0.9, transition: OUT },
  shown: { opacity: 1, scale: 1, transition: IN },
}
