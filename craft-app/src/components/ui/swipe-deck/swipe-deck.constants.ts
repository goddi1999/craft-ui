// --deck-drag: the top card following the pointer, no overshoot, no lag
export const DRAG_SPRING = { type: 'spring', stiffness: 900, damping: 50, mass: 1 } as const
// --deck-return: snapping back when it was not thrown far enough
export const RETURN_SPRING = { type: 'spring', stiffness: 280, damping: 16, mass: 1 } as const
// hard-coded in deck.js: damped enough that a thrown card keeps going instead of swinging back
export const THROW_SPRING = { type: 'spring', stiffness: 70, damping: 17, mass: 1 } as const
// hard-coded in deck.js: the cards behind moving up a level
export const DEPTH_SPRING = { type: 'spring', stiffness: 260, damping: 22, mass: 1 } as const

// --deck-threshold: px of drag that counts as a decision
export const THRESHOLD = 110
// a flick faster than this (px/s) decides even short of the threshold
export const FLICK_SPEED = 700
// a thrown card always leaves at least this fast (px/s), even from a key press
export const THROW_SPEED = 1500
// it aims this far past half the window, or this far ahead of itself, whichever is further
export const THROW_PAST_EDGE = 360
export const THROW_AHEAD = 420
// a bit of the vertical flick carries into the throw, capped in px
export const THROW_DRIFT = 0.2
export const THROW_DRIFT_MAX = 120
// how long a thrown card flies before it rejoins at the back
export const RECYCLE_MS = 420

// the pointer speed is averaged with the last reading so one jittery event cannot decide
export const VELOCITY_SMOOTHING = 0.5
// vertical drag only follows at 60%, so a throw reads as sideways
export const DRAG_Y = 0.6
// degrees of tilt per px of drag
export const TILT = 0.065
// the cards behind are fully risen once the top card is this many thresholds away
export const LIFT_SPAN = 1.6

// per level of depth a card is smaller, lower and darker; past three it fades out
export const LEVELS = 3
export const LEVEL_SCALE = 0.055
export const LEVEL_Y = 16
export const LEVEL_DIM = 0.22
export const FADE_DEPTH = 3.6
