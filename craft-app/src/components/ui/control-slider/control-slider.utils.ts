import { RUBBER } from './control-slider.constants'

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/**
 * iOS rubber-banding: the further past the edge, the less each extra px counts,
 * approaching `limit` but never reaching it. Keeps the sign of `distance`.
 */
export function rubberBand(distance: number, limit: number) {
  if (limit <= 0 || distance === 0) return 0
  const travel = Math.abs(distance)
  const stretched = (travel * limit * RUBBER) / (limit + RUBBER * travel)
  return Math.sign(distance) * stretched
}
