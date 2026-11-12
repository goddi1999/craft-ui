import type { Variants } from 'motion/react'

export const DEFAULT_OPTIONS = ['Home', 'About', 'Projects', 'Contact', 'Book a call', 'Follow us']

// sizes in px
export const WIDTH = 306
export const PILL_HEIGHT = 56
export const GAP = 12
export const ROW_HEIGHT = 44
export const PANEL_PAD = 10
export const PANEL_RADIUS = 22
// room under the panel so the drop can overshoot without shifting the page
export const BOTTOM_ROOM = 24

// blur, then a hard alpha threshold: the pill and panel melt together while they are close
export const GOO_BLUR = 10
export const GOO_MATRIX = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -14'

// the panel drops first and grows a beat later, so it stretches off the pill like a drop
export const DROP_SPRING = { type: 'spring', stiffness: 240, damping: 17, mass: 1 } as const
export const GROW_SPRING = { type: 'spring', stiffness: 210, damping: 22, mass: 1 } as const
export const GROW_DELAY = 0.05
export const SNAP_SPRING = { type: 'spring', stiffness: 240, damping: 20, mass: 0.9 } as const
export const ROW_SPRING = { type: 'spring', stiffness: 420, damping: 26 } as const
export const CHEVRON_SPRING = { type: 'spring', stiffness: 300, damping: 20 } as const
export const FADE = { duration: 0.15 } as const
export const INSTANT = { duration: 0 } as const

export const LIST_VARIANTS = {
  open: { transition: { staggerChildren: 0.035, delayChildren: 0.12 } },
  closed: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
} satisfies Variants

export const ROW_VARIANTS = {
  open: { opacity: 1, y: 0, transition: ROW_SPRING },
  closed: { opacity: 0, y: -10, transition: SNAP_SPRING },
} satisfies Variants

// reduced motion: the rows fade in place, all at once
export const STILL_LIST_VARIANTS = { open: {}, closed: {} } satisfies Variants

export const STILL_ROW_VARIANTS = {
  open: { opacity: 1, y: 0, transition: FADE },
  closed: { opacity: 0, y: 0, transition: FADE },
} satisfies Variants

// the menu stays dark on either page background
export const SURFACE = 'bg-black dark:bg-[#0E0E0E]'
export const FOCUS_RING = 'outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]'
export const SELECTED_DOT = 'bg-[#3B82F6]'
