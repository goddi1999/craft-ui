import type { Transition, Variants } from 'motion/react'

export const COLUMNS = 4
// each result closes this share of the gap left, so the ring fills fast early and never hits the end on its own
export const STEP = 0.3
export const START = 0.08
export const CREEP = 0.25
export const CREEP_SECONDS = 4
export const RING_HOLD = 0.45
export const STACK = 4
// hover waits a beat before acting, so a pointer just passing through never triggers it
export const SPREAD_DELAY = 150
export const PREVIEW_DELAY = 300
export const LEAVE_DELAY = 150

export const SWAP: Transition = { type: 'spring', duration: 0.55, bounce: 0.1 }
export const POP: Transition = { type: 'spring', duration: 0.5, bounce: 0.4 }
export const SPREAD: Transition = { type: 'spring', duration: 0.35, bounce: 0 }
export const OPEN: Transition = { type: 'spring', duration: 0.5, bounce: 0.08 }
export const CARD: Transition = { type: 'spring', duration: 0.5, bounce: 0.1 }
export const TOOLTIP: Transition = { type: 'spring', duration: 0.35, bounce: 0.15 }
export const STAGGER = 0.045
export const RING: Transition = { type: 'spring', duration: 0.6, bounce: 0 }
export const INSTANT: Transition = { duration: 0 }

export const swapVariants: Variants = {
  enter: { y: 6, opacity: 0, filter: 'blur(3px)' },
  center: { y: 0, opacity: 1, filter: 'blur(0px)' },
  exit: { y: -6, opacity: 0, filter: 'blur(3px)' },
}

export const cardVariants: Variants = {
  enter: { opacity: 0, y: 8, scale: 0.97, filter: 'blur(6px)' },
  center: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.97, filter: 'blur(4px)' },
}

// the highlight sits mid gradient and the size leaves room either side, so each sweep starts off screen
export const SHIMMER =
  'linear-gradient(90deg, var(--web-search-ink) 40%, var(--web-search-shine) 50%, var(--web-search-ink) 60%)'

export const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const RING_CIRCLE = { ...STROKE, cx: 14, cy: 14, r: 13, strokeWidth: 1.5 }

// the pill, cards and chips share one surface; hover lifts it to the page colour in light and a step lighter in dark
export const SURFACE = 'bg-muted'
export const SURFACE_HOVER =
  'hover:bg-background dark:hover:bg-[color-mix(in_oklab,var(--muted),var(--foreground)_6%)]'
export const RAISED = 'bg-background dark:bg-[color-mix(in_oklab,var(--muted),var(--foreground)_10%)]'
export const LIFT_SHADOW =
  'hover:shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.04),0_2px_4px_-1px_rgba(0,0,0,0.08)] dark:hover:shadow-none'
export const FOCUS_RING =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

// the li takes the hover and the card inside lifts, so the lift can't slide the card out from under the pointer
// the hover shadow stays inside the 4px the collapse leaves around the cards, or its clip shows as a hard edge
export const CARD_SHELL = [
  'flex h-[84px] w-full cursor-pointer flex-col rounded-[14px] p-2.5 text-left transition-[background-color,box-shadow,translate] duration-200 group-hover/card:-translate-y-0.5',
  SURFACE,
  SURFACE_HOVER,
  LIFT_SHADOW,
  FOCUS_RING,
].join(' ')

export const STREAM_SPEED = 80
// past this many waiting characters, each tick writes more so a live stream never falls behind
export const CATCH_UP = 120
export const SENTENCE_PAUSE = 180
export const CLAUSE_PAUSE = 70
