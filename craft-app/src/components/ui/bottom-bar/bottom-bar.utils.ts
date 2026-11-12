export const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

/** Critically damped under reduced motion: same stiffness, no overshoot. */
export function settle<T extends { stiffness: number; damping: number }>(
  spring: T,
  reduced: boolean,
) {
  return reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring
}
