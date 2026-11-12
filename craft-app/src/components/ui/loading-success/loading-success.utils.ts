import {
  IDLE_WIDTH,
  LOADING_WIDTH,
  PAD_X,
  SUCCESS_WIDTH,
} from './loading-success.constants'
import type { LoadingSuccessStatus } from './loading-success.types'

type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** Reduced motion keeps the spring but damps it critically, so nothing overshoots. */
export const springFor = (spring: Spring, reduced: boolean) =>
  reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness * spring.mass) } : spring

/** The pill width for a status: the source widths, or wider when the content needs it. */
export function widthFor(
  status: LoadingSuccessStatus,
  content: { label: number; done: number },
) {
  if (status === 'loading') return LOADING_WIDTH
  if (status === 'success') return Math.max(SUCCESS_WIDTH, content.done + PAD_X * 2)
  return Math.max(IDLE_WIDTH, content.label + PAD_X * 2)
}
