// a classic green / deep red / grey palette with a lighter take for dark mode; the root sets
// the variables, so one prop value works in both themes
export const CORRECT_COLOR = 'var(--blank-correct)'
export const WRONG_COLOR = 'var(--blank-wrong)'
export const PALETTE_VARS =
  '[--blank-correct:#128238] [--blank-wrong:#A50B0B] [--blank-muted:#9E9E9E] dark:[--blank-correct:#34A85F] dark:[--blank-wrong:#D9473F] dark:[--blank-muted:#8A8A8A]'

export const EASE_OUT = [0.23, 1, 0.32, 1] as const

// the word dissolves out of the grey box before the caret takes its place
export const VANISH = { duration: 0.18, ease: EASE_OUT } as const
// the box settles from the word's width to the empty blank's
export const RESIZE = { duration: 0.22, ease: EASE_OUT } as const

// correct: a quick lift, then an elastic settle (like gsap's elastic.out(1, 0.3))
export const LIFT = { duration: 0.14, ease: EASE_OUT } as const
export const LIFT_Y = -10
export const SETTLE = { type: 'spring', stiffness: 600, damping: 9 } as const

// wrong: a small, quick shake
export const SHAKE_X = [0, -6, 6, -4, 4, -2, 0]
export const SHAKE = { duration: 0.4, ease: 'easeInOut' } as const

/** Width of an empty blank, so there is always a box to type into. */
export const EMPTY = '   '

/** How long the pointer rests on the blank before the reason opens, in ms. */
export const REASON_DELAY_MS = 700
// the reason types itself out: a short pause, then one character at a time
export const TYPE_DELAY_MS = 120
export const TYPE_STEP_MS = 28
