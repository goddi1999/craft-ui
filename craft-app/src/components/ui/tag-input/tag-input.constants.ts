// tags.js has no tokens for these; the values are its hard-coded springs.
// chip width: grows from 0 to the width of its word, a little past it, and back
export const WIDTH_SPRING = { type: 'spring', stiffness: 340, damping: 26, mass: 1 } as const
// chip scale: pops in from half size with a bounce
export const POP_SPRING = { type: 'spring', stiffness: 420, damping: 16, mass: 1 } as const
// chip opacity
export const FADE_SPRING = { type: 'spring', stiffness: 300, damping: 26, mass: 1 } as const

export const ENTER_SCALE = 0.5
export const EXIT_SCALE = 0.6
// the chip leaves the DOM after this, whatever the springs are doing
export const EXIT_MS = 450
// px, the gap between chips; a leaving chip pulls it closed as it shrinks
export const GAP = 6
