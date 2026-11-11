/** Bounce-free spring for the sliding pill. */
export const SPRING = { type: 'spring', duration: 0.3, bounce: 0 } as const

/** Keyboard-initiated changes never wait. */
export const INSTANT = { duration: 0 } as const
