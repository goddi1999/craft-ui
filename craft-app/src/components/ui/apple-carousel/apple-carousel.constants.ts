import type { Transition } from 'motion/react'

// More than anyone can fling past before the wrap runs, so the loop's seam
// never scrolls into view.
export const CLONE_COUNT = 4

// Debounce for "scroll settled", and how long scroll events after our own
// writes are ignored.
export const SETTLE_DELAY = 150

// Spring visualDuration (s), longer for long jumps so they don't whip past.
export const SCROLL_BASE_DURATION = 0.5
export const SCROLL_EXTRA_CARD_DURATION = 0.1
export const SCROLL_MAX_DURATION = 0.9

// Points sit half a stroke inside the outline, so the round joins soften the
// corners without growing the icon. Changing the width means re-insetting them.
export const ICON_STROKE_WIDTH = 2.5

// Matching M L L L Z commands let motion morph `d`: the play triangle is split
// at x = 13, one half per pause bar.
export const PAUSE_ICON = {
  left: 'M5.5 5.5L8.5 5.5L8.5 18.5L5.5 18.5Z',
  right: 'M15.5 5.5L18.5 5.5L18.5 18.5L15.5 18.5Z',
} as const

export const PLAY_ICON = {
  left: 'M7.5 5.87L13 9.08L13 14.92L7.5 18.13Z',
  right: 'M13 9.08L18.01 12L18.01 12L13 14.92Z',
} as const

export const ICON_TRANSITION: Transition = {
  type: 'spring',
  visualDuration: 0.3,
  bounce: 0,
}

export const INSTANT_TRANSITION: Transition = { duration: 0 }
