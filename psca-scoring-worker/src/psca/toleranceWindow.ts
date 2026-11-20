import type { ToleranceWindow } from '../schemas'

/**
 * Computes the effective tolerance window for one step result.
 *
 * Formula:
 * `epsilon = max(abs, rel * |expected|)`
 */
export function computeTolerance(expected: number, cfg: ToleranceWindow): number {
  return Math.max(cfg.abs, cfg.rel * Math.abs(expected))
}
