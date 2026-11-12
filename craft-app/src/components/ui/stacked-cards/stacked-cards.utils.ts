import { MIN_SCALE, SCALE_STEP, STICKY_STEP, STICKY_TOP } from './stacked-cards.constants'

/**
 * When a card starts to shrink, as a share of the stack's scroll, and how small it ends up.
 * It starts once the cards after it begin to scroll in; deeper cards end smaller.
 */
export function cardDepth(index: number, total: number) {
  return {
    range: [index / total, 1],
    scale: Math.max(MIN_SCALE, 1 - (total - index - 1) * SCALE_STEP),
  }
}

export const stickyTop = (index: number) => `calc(${STICKY_TOP} + ${index * STICKY_STEP}px)`
