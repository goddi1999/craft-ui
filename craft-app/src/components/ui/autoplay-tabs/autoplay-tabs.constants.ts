import type { Transition } from 'motion/react'

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
