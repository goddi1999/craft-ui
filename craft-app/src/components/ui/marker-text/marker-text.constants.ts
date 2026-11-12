import type { MarkType } from './marker-text.types'

// circle follows the accent and strike uses destructive; highlight, underline and
// box have no theme token, so they keep fixed inks (box gets a lighter dark variant)
export const DEFAULT_INK: Record<MarkType, string> = {
  highlight: 'fill-[#facc15]',
  underline: 'fill-[#f97316]',
  circle: 'fill-primary',
  box: 'fill-[#16a34a] dark:fill-[#22c55e]',
  strike: 'fill-destructive',
}

export const DEFAULT_GAP = 140
// draws once the text is this much on screen
export const VIEW_THRESHOLD = 0.6

// how fast the pen travels, in px per ms; a hand slows down on long strokes,
// so durations are clamped rather than strictly proportional
export const PEN_SPEED = 0.9
export const HIGHLIGHT_SPEED = 1.15
export const MIN_MS = 260
export const MAX_MS = 820
// lifting the pen between two lines of the same mark
export const LINE_GAP = 60
// a hand accelerates into a stroke and eases out of it
export const PEN_EASE = 'cubic-bezier(0.45, 0.05, 0.25, 1)'
// the layers are 1px boxes that overflow, so masks need an explicit region
export const MASK_SPAN = 20_000
// highlighter ink is see-through
export const HIGHLIGHT_ALPHA = 0.42
