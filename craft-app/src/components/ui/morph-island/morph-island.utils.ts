import { GIVE, GIVE_VELOCITY } from './morph-island.constants'

export type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** Reduced motion keeps the stiffness but damps critically, so nothing overshoots. */
export const withReducedMotion = (spring: Spring, reduced: boolean): Spring =>
  reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring

/** How much the width gives back while the height is moving, as a fraction. */
export const giveFor = (heightVelocity: number) =>
  clamp(-heightVelocity / GIVE_VELOCITY, -GIVE, GIVE)

/** 299 → `04:59`. */
export function formatClock(seconds: number) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const rest = String(Math.floor(seconds % 60)).padStart(2, '0')
  return `${minutes}:${rest}`
}
