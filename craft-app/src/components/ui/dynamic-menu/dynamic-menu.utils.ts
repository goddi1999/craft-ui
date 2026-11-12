import {
  CLOSE_STAGGER_MS,
  CLOSED,
  LIST_PAD,
  OPEN_DELAY_MS,
  OPEN_STAGGER_MS,
  ROW_HEIGHT,
} from './dynamic-menu.constants'

export type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** Reduced motion keeps the stiffness but damps critically, so nothing overshoots. */
export const withReducedMotion = <T extends Spring>(spring: T, reduced: boolean): T =>
  reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring

/** The open panel fits the pill row plus every link row. */
export const openHeight = (rows: number) =>
  CLOSED.height + LIST_PAD.top + rows * ROW_HEIGHT + LIST_PAD.bottom

/** Opening waits a beat and goes top down; closing goes bottom up and quicker. */
export const linkDelay = (index: number, count: number, open: boolean) =>
  open ? OPEN_DELAY_MS + index * OPEN_STAGGER_MS : (count - 1 - index) * CLOSE_STAGGER_MS
