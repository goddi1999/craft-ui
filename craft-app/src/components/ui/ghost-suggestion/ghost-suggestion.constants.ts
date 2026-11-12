// ghost.js tabS: the Tab key popping in, and dropping away on accept
export const TAB_SPRING = { type: 'spring', stiffness: 520, damping: 24, mass: 1 } as const
// ghost.js fade and each letter's opacity: no overshoot
export const FADE_SPRING = { type: 'spring', stiffness: 300, damping: 30, mass: 1 } as const
// ghost.js letter y: low damping so an accepted letter hops and settles back
export const HOP_SPRING = { type: 'spring', stiffness: 520, damping: 16, mass: 1 } as const

// px per second, a kick upwards from rest
export const HOP_VELOCITY = -70
// the key goes down and away
export const TAB_DROP_VELOCITY = -9
// the key grows from 60% and can overshoot to 108%
export const TAB_MIN_SCALE = 0.6
export const TAB_MAX = 1.2

export const TYPE_DELAY_MS = 300
export const TYPE_STEP_MS = 45
// the pause after the last typed letter before the suggestion shows up
export const OFFER_PAUSE_MS = 450
export const OFFER_STAGGER_MS = 8
export const ACCEPT_AFTER_MS = 1500
export const ACCEPT_STAGGER_MS = 16
// after the last letter brightens: hold, then fade, then the next note
export const HOLD_MS = 1700
export const NEXT_MS = 2200

// on for 1/1.8 s, off for the same
export const BLINK_S = 2 / 1.8
