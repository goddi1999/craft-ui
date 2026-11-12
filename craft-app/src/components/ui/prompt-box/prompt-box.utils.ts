import { animate, type MotionValue } from 'motion/react'

type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** Springs a value to `to`; reduced motion damps critically so nothing overshoots. */
export function springTo(value: MotionValue<number>, to: number, spring: Spring, reduced: boolean) {
  animate(value, to, reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring)
}
