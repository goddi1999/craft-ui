import { DOT_COLORS, DOT_EXTRA, DOT_REACH, DOT_START, DOT_TURN } from './like-burst.constants'

type Spring = { stiffness: number; damping: number }

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** Reduced motion keeps each spring's speed but makes it critically damped, so nothing overshoots. */
export const settle = <T extends Spring>(spring: T, reduced: boolean): T =>
  reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring

/** Where dot `index` sits at burst progress `k` (0 to 1): out fast, then slowing down. */
export function dotOffset(index: number, k: number) {
  const angle = (index / DOT_COLORS.length) * Math.PI * 2 + DOT_TURN
  const eased = 1 - (1 - k) ** 3
  const distance = DOT_START + eased * (DOT_REACH + (index % 2) * DOT_EXTRA)
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance }
}
