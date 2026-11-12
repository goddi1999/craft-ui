type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }

/** Critically damped under reduced motion (no overshoot), the same thing the source engine does. */
export function springFor(spring: Spring, reduced: boolean): Spring {
  return reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring
}

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/**
 * 0 when shorter than 6, otherwise 1 plus a point each for 8+ chars with mixed case,
 * a number, and a symbol in 10+ chars. Tops out at 4.
 */
export function scorePassword(password: string) {
  if (password.length < 6) return 0
  let score = 1
  if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password) && password.length >= 10) score++
  return score
}
