type Spring = { stiffness: number; damping: number }

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** Reduced motion keeps each spring's speed but makes it critically damped, so nothing overshoots. */
export const settle = <T extends Spring>(spring: T, reduced: boolean): T =>
  reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring
