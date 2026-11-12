// roll.js letter s: each letter rolling up out of the slot, or in from below
export const LETTER_SPRING = { type: 'spring', stiffness: 420, damping: 26, mass: 1 } as const
// roll.js width: the slot stretching to the new word
export const WIDTH_SPRING = { type: 'spring', stiffness: 320, damping: 30, mass: 1 } as const

export const INTERVAL_MS = 2400
export const ENTER_DELAY_MS = 60
export const ENTER_STAGGER_MS = 28
export const EXIT_STAGGER_MS = 22
// how long a word that rolled out stays mounted
export const REMOVE_MS = 1000

// a letter one step off the line sits 105% of its height below (or above) it
export const SHIFT = 105
// and has faded this much
export const FADE = 0.9
