import type { PscaResult, PscaScoreRequest } from '../schemas'
import { pscaScore } from './pscaScoring'

function buildZeroResult(): PscaResult {
  return {
    score: 0,
    R: 0,
    S: 0,
    M: 0,
    E: 0,
    perStep: [],
    awardedPoints: 0,
  }
}

/**
 * Public PSCA entry point — orchestrates the pure scoring core behind the
 * package contract (`PscaScoreRequest` → `PscaResult`).
 *
 * Deterministic: same request → same result. No React, no canvas, no Supabase.
 *
 * Edge-case contract (WQ-55):
 * - empty `tree` → zero score, `awardedPoints = 0`, empty `perStep` (no throw)
 * - invalid `tree` (unknown dep, cycle) → throws {@link PscaValidationError} with `code: 'INVALID_STEP_TREE'`
 * - missing student answer for a node → that step scores `s = 0`, `m = 0`, `e = 0`
 * - `pointsMax ≤ 0` → `awardedPoints = 0` (no throw); `awardedPoints` is always clamped to `[0, pointsMax]`
 */
export function runPscaPipeline(request: PscaScoreRequest): PscaResult {
  const { tree, studentAnswers, config, pointsMax } = request
  if (tree.length === 0) return buildZeroResult()

  const safePointsMax = Math.max(0, pointsMax)
  const result = pscaScore(tree, studentAnswers, config, safePointsMax)

  return {
    ...result,
    awardedPoints: Math.min(Math.max(result.awardedPoints, 0), safePointsMax),
  }
}
