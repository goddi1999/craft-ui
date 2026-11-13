// zooming in and out is one continuous move; a critically damped spring keeps it interruptible
export const ZOOM = { type: 'spring', duration: 0.55, bounce: 0 } as const
export const SNAP = { type: 'spring', duration: 0.45, bounce: 0.1 } as const

// gap between full-size pages when sliding page to page, and between cards in the strip
export const PAGE_GAP = 24
export const CARD_GAP = 14
// visible corner radius of a page at full size
export const RADIUS = 18

// a drag shorter than this still counts as a click on a card
export const DRAG_SLOP = 6
// how far a fling carries, in seconds of travel
export const FLING = 0.18
// wheel sensitivity, and how long after the last wheel event the strip settles
export const WHEEL = 0.7
export const WHEEL_SETTLE_MS = 140
