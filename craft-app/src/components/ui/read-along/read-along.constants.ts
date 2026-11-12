// read.js, no token: the pill edge in front of the move is quick
export const LEAD_SPRING = { type: 'spring', stiffness: 520, damping: 40, mass: 1 } as const
// read.js, no token: the edge behind lags, which is what stretches the pill
export const TRAIL_SPRING = { type: 'spring', stiffness: 210, damping: 26, mass: 1 } as const
// read.js, no token: moving between lines (it reopens there, so this is barely seen)
export const LINE_SPRING = { type: 'spring', stiffness: 600, damping: 48, mass: 1 } as const
// read.js, no token: the pill fading in and out
export const FADE_SPRING = { type: 'spring', stiffness: 300, damping: 30, mass: 1 } as const

// em the pill reaches past each side of a word
export const PAD_EM = 0.16
// pill height in em, it sits centred on the line
export const PILL_EM = 1.3

// a word is read for 200ms plus 35ms a character
export const DWELL_MS = 200
export const DWELL_PER_CHAR_MS = 35
// the last word holds a little longer, then the pill fades and it starts over
export const LAST_WORD_MS = 1800
export const START_MS = 1000
export const RESTART_MS = 1100

// px of vertical change that counts as a new line
export const LINE_TOLERANCE = 2
// below this opacity the pill counts as gone and opens fresh instead of sliding
export const GONE_OPACITY = 0.05
