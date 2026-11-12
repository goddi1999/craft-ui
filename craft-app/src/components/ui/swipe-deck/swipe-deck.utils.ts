import { FLICK_SPEED, LIFT_SPAN } from './swipe-deck.constants'
import type { SwipeDeckItem } from './swipe-deck.types'

type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/** Reduced motion keeps the stiffness but damps critically, so nothing overshoots. */
export function calm(spring: Spring, reduced: boolean): Spring {
  return reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring
}

/** How far the cards behind have risen, 0..1, from the top card's offset. */
export const liftOf = (x: number, threshold: number) =>
  clamp(Math.abs(x) / (threshold * LIFT_SPAN), 0, 1)

/** 1 or -1 when a release counts as a throw, 0 when the card should snap back. */
export function decide(x: number, vx: number, threshold: number): -1 | 0 | 1 {
  if (Math.abs(x) > threshold) return x > 0 ? 1 : -1
  // a quick flick counts too, as long as it goes the way the card already leans
  if (Math.abs(vx) > FLICK_SPEED && Math.sign(vx) === Math.sign(x || vx)) return vx > 0 ? 1 : -1
  return 0
}

/** Keeps the deck order for cards that are still there and adds new ones at the back. */
export function reconcile(order: string[], ids: string[]) {
  const kept = order.filter((id) => ids.includes(id))
  return [...kept, ...ids.filter((id) => !kept.includes(id))]
}

export const cardLabel = (item: SwipeDeckItem) =>
  [item.title, item.aside, item.description].filter(Boolean).join(', ')
