// side.js W = S(212, 260, 24), the --spring-soft preset: the panel folding to a rail and back
export const WIDTH_SPRING = { type: 'spring', stiffness: 260, damping: 24, mass: 1 } as const
// side.js R = S(0, 300, 22): the toggle arrow turning over and sliding onto the logo
export const TURN_SPRING = { type: 'spring', stiffness: 300, damping: 22, mass: 1 } as const
// side.js label springs S(1, 300, 26): each label fading and sliding in
export const LABEL_SPRING = { type: 'spring', stiffness: 300, damping: 26, mass: 1 } as const
// side.js Y = S(0, 380, 28): the highlight moving to the picked item
export const HIGHLIGHT_SPRING = { type: 'spring', stiffness: 380, damping: 28, mass: 1 } as const

// px
export const OPEN_WIDTH = 212
export const RAIL_WIDTH = 64
// a 44 px item plus the 2 px gap
export const ROW_STEP = 46
// a hidden label waits this far to the left
export const LABEL_SHIFT = -10
// closed, the toggle slides a little left so it sits where the logo was
export const TOGGLE_SHIFT = -4

// opening waits 60 ms, then each label down the list waits 40 ms more; closing hides them all at once
export const LABEL_DELAY_MS = 60
export const LABEL_STAGGER_MS = 40
