type Spring = {
  readonly type: 'spring'
  readonly stiffness: number
  readonly damping: number
  readonly mass: number
}

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** Keeps an index inside the list, counting back from the end for negatives. */
export const wrap = (index: number, length: number) => ((index % length) + length) % length

/** Critically damped under reduced motion: same speed, no overshoot. */
export function springFor(spring: Spring, reduced: boolean) {
  return reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness * spring.mass) } : spring
}
