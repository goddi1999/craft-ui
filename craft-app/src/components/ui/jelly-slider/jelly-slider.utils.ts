import { MARK_COUNT, RUBBER_LIMIT, THUMB_RADIUS } from './jelly-slider.constants'

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** Critically damped under reduced motion: same stiffness, no overshoot. */
export function settle<T extends { stiffness: number; damping: number }>(
  spring: T,
  reduced: boolean,
) {
  return reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring
}

/** Past either end the pointer meets resistance that tops out at `RUBBER_LIMIT` px. */
export function rubber(x: number, min: number, max: number) {
  const pull = (over: number) => (1 - 1 / ((over * 0.55) / RUBBER_LIMIT + 1)) * RUBBER_LIMIT
  if (x < min) return min - pull(min - x)
  if (x > max) return max + pull(x - max)
  return x
}

// the hidden-iframe case: width can be 0, so never divide by it
const travel = (width: number) => Math.max(width - 2 * THUMB_RADIUS, 1)

export type Range = { min: number; max: number; step: number }

const decimalsOf = (step: number) => {
  const text = String(step)
  return text.includes('.') ? text.length - text.indexOf('.') - 1 : 0
}

export function snap(value: number, { min, max, step }: Range) {
  const stepped = min + Math.round((value - min) / step) * step
  // toFixed drops the float noise from adding steps like 0.1
  return clamp(Number(stepped.toFixed(decimalsOf(step))), min, max)
}

/** Value → thumb centre in px. */
export function toPx(value: number, width: number, { min, max }: Range) {
  const ratio = max === min ? 0 : (clamp(value, min, max) - min) / (max - min)
  return THUMB_RADIUS + ratio * travel(width)
}

/** Thumb centre in px → value on the step grid. */
export function toValue(px: number, width: number, range: Range) {
  const ratio = clamp((px - THUMB_RADIUS) / travel(width), 0, 1)
  return snap(range.min + ratio * (range.max - range.min), range)
}

/** How many scale marks the value has passed; -1 at the very start so nothing lights. */
export function litMarks(value: number, { min, max }: Range) {
  if (value <= min || max === min) return -1
  // the epsilon keeps 25% from reading as 24.999…% and missing its mark
  return Math.floor(((value - min) / (max - min)) * (MARK_COUNT - 1) + 1e-9)
}
