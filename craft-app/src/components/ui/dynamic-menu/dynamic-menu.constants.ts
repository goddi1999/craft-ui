// menu.css: the closed pill, the open width and the link rows, px
export const CLOSED = { width: 150, height: 52 } as const
export const OPEN_WIDTH = 300
export const ROW_HEIGHT = 48
// list padding above and below the rows
export const LIST_PAD = { top: 4, bottom: 10 } as const
// corner radius, closed pill -> open panel
export const RADIUS = { closed: 26, open: 22 } as const

// menu.js springs, none of them tokens.
// width lands first...
export const WIDTH_SPRING = { type: 'spring', stiffness: 320, damping: 26, mass: 1 } as const
// ...height is a little softer, so the panel lands after it has widened
export const HEIGHT_SPRING = { type: 'spring', stiffness: 240, damping: 22, mass: 1 } as const
// the two lines turning into a cross, and the corners
export const TOGGLE_SPRING = { type: 'spring', stiffness: 380, damping: 24, mass: 1 } as const
// each link rising in
export const LINK_SPRING = { type: 'spring', stiffness: 260, damping: 22, mass: 1 } as const

// opening waits a beat, then a link every 50ms; closing drops them bottom first, 30ms apart
export const OPEN_DELAY_MS = 80
export const OPEN_STAGGER_MS = 50
export const CLOSE_STAGGER_MS = 30
// px a link rises from
export const LINK_RISE = 18

// the toggle lines sit 8px apart, meet in the middle and turn this far each way
export const LINE_OFFSET = 4
export const CROSS_DEGREES = 45
// the cross may overshoot this far past either end before it is held
export const CROSS_OVERSHOOT = 0.1

// --surface on the stage: a raised object in both themes
export const SURFACE = 'bg-muted'
// --fill-2: the badge chip
export const BADGE_FILL = 'bg-foreground/[0.09]'
