export type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** Reduced motion keeps the stiffness but damps critically, so nothing overshoots. */
export const withReducedMotion = <T extends Spring>(spring: T, reduced: boolean): T =>
  reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring

function decimalsOf(value: number) {
  const [, fraction = ''] = String(value).split('.')
  return fraction.length
}

/** One step from `value`, clamped, and rounded to the step's decimals so 0.1 + 0.2 stays 0.3. */
export function stepFrom(value: number, direction: 1 | -1, step: number, min: number, max: number) {
  const next = clamp(value + direction * step, min, max)
  return Number(next.toFixed(Math.max(decimalsOf(step), decimalsOf(value))))
}

/** The longest value the box has to fit, so the width never jumps between numbers. */
export function widestValue(value: number, min: number, max: number) {
  const bounds = [min, max].filter(Number.isFinite).map(String)
  return [String(value), ...bounds].reduce((widest, text) => (text.length > widest.length ? text : widest))
}
