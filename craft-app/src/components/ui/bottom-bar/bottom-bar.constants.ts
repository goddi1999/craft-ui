// bar.js, hardcoded 300 26: each label opening and closing
export const LABEL_SPRING = { type: 'spring', stiffness: 300, damping: 26, mass: 1 } as const
// bar.js, hardcoded 340 28: the pill chasing the picked tab's live position and width
export const PILL_SPRING = { type: 'spring', stiffness: 340, damping: 28, mass: 1 } as const
// bar.js, hardcoded 520 14 (--spring-pop is 520 16): the icon squash and pop on pick
export const POP_SPRING = { type: 'spring', stiffness: 520, damping: 14, mass: 1 } as const

// the pop starts squashed and already growing
export const POP_FROM = 0.72
export const POP_VELOCITY = 6

// px between the icon and the label once open
export const LABEL_GAP = 8
