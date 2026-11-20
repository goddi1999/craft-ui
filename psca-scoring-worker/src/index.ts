/**
 * @wq/psca-scoring — public barrel.
 *
 * Consumers (Game Studio, future HTTP worker) import only from here.
 * Algorithm internals under `src/psca/` are private to the package.
 */

export { runPscaPipeline } from './psca/pipeline'
export { computeTolerance } from './psca/toleranceWindow'
export { PscaValidationError } from './errors'
export type { PscaValidationErrorCode } from './errors'
export {
  DEFAULT_SCORING_WEIGHTS,
  R_ONLY_SCORING_WEIGHTS,
  DEFAULT_TOLERANCE,
  DEFAULT_SCORING_CONFIG,
  R_ONLY_SCORING_CONFIG,
} from './constants'
export type {
  StepOperator,
  ScoringMode,
  StepRef,
  StepOperand,
  StepNode,
  StudentNotation,
  StudentStep,
  ScoringWeights,
  ToleranceWindow,
  ScoringConfig,
  StepBreakdown,
  PscaResult,
  PscaScoreRequest,
} from './schemas'
