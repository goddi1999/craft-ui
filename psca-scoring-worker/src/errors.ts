export type PscaValidationErrorCode = 'INVALID_STEP_TREE'

/**
 * Thrown when a step tree is structurally unusable for scoring
 * (empty tree passed to the tree utilities directly, unknown dependency id, or cycle).
 *
 * `runPscaPipeline` never throws for an empty `tree` — it returns a zero result instead.
 */
export class PscaValidationError extends Error {
  readonly code: PscaValidationErrorCode

  constructor(message: string, code: PscaValidationErrorCode = 'INVALID_STEP_TREE') {
    super(message)
    this.name = 'PscaValidationError'
    this.code = code
  }
}
