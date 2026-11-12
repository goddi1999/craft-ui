// expand.js has no tokens for these; the values are its hard-coded springs.
// one progress spring per row drives height, photo, title and price together
export const OPEN_SPRING = { type: 'spring', stiffness: 240, damping: 21, mass: 1 } as const
// the details fading and sliding in under the photo
export const DETAILS_SPRING = { type: 'spring', stiffness: 260, damping: 28, mass: 1 } as const
// a row riding up to the top, or sinking away
export const SLIDE_SPRING = { type: 'spring', stiffness: 300, damping: 26, mass: 1 } as const
export const SHRINK_SPRING = { type: 'spring', stiffness: 300, damping: 26, mass: 1 } as const
export const FADE_SPRING = { type: 'spring', stiffness: 300, damping: 30, mass: 1 } as const

// the details wait until the photo has started to grow
export const DETAILS_DELAY_MS = 160

// px, from expand.css
export const LIST_HEIGHT = 280
export const ROW_HEIGHT = 72
export const ROW_GAP = 8
export const INSET = 12
export const THUMB = 48
export const THUMB_GROW = 56
export const THUMB_RADIUS = 12
export const THUMB_RADIUS_GROW = 4
export const HEAD_X = 72
export const HEAD_SHIFT = 56
export const HEAD_Y = 16
export const HEAD_DROP = 112
export const PRICE_Y = 26
export const PRICE_DROP = 106
export const DETAILS_TOP = 176
export const DETAILS_BOTTOM = 16
export const DETAILS_RISE = 10

// the rows that make way slide this far and shrink a little
export const AWAY_SHIFT = 24
export const AWAY_SCALE = 0.94
