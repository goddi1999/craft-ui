import type { DnDMathBlock } from './dnd-math.types'

export const DEFAULT_LOCALE = 'de-DE'
export const DEFAULT_POINTS = 10

/** Palette blocks, in order. */
export const BLOCKS: ReadonlyArray<{ block: DnDMathBlock; label: string; hint: string }> = [
  { block: 'equation', label: 'Equation', hint: 'Type a step like 40 × 8,50 €' },
  { block: 'sum', label: 'Sum', hint: 'Drop results in to add them up' },
]

/** Pixels the pointer travels before a press becomes a drag. Below it, it's a click. */
export const DRAG_THRESHOLD = 4

/** How far outside the canvas a drop still counts, in px. */
export const DROP_SLOP = 24

export const EASE_OUT = [0.23, 1, 0.32, 1] as const

/** Rows and chips entering: a short rise from 97 %. */
export const ENTER = { duration: 0.2, ease: EASE_OUT } as const
export const EXIT = { duration: 0.15, ease: EASE_OUT } as const

/** The dragged copy: lifts on pickup, springs home on a cancelled drop. */
export const LIFT = { duration: 0.15, ease: EASE_OUT } as const
export const RETURN = { type: 'spring', duration: 0.35, bounce: 0.15 } as const
export const LIFT_SCALE = 1.04
export const LIFT_ROTATE = -1.5

/** A rejected answer: the same small shake as Blank Text. */
export const SHAKE_X = [0, -6, 6, -4, 4, -2, 0]
export const SHAKE = { duration: 0.4, ease: 'easeInOut' } as const

/** Check marks land one row after another. */
export const MARK_STAGGER = 0.05
