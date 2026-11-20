/**
 * PSCA domain contract — normalized scoring inputs and deterministic output.
 *
 * DSGVO: these shapes carry only numeric step values, operators, and unit labels —
 * never raw Lexical HTML, free text, or personal data.
 */

export type StepOperator = '×' | '+' | '−' | '÷' | 'Σ'
export type ScoringMode = 'carry' | 'strict'

export type StepRef = { ref: string }
export type StepOperand = number | StepRef

export type StepNode = {
  id: string
  operator: StepOperator
  operands: StepOperand[]
  expected: number
  unit: string
  deps: string[]
}

export type StudentNotation = {
  decimal: 'comma' | 'dot'
  rounded: boolean
}

export type StudentStep = {
  nodeId: string
  operator: StepOperator
  operands: StepOperand[]
  actual: number
  unit: string
  notation: StudentNotation
}

export type ScoringWeights = {
  result: number
  steps: number
  method: number
  errorFree: number
}

export type ToleranceWindow = {
  abs: number
  rel: number
}

export type ScoringConfig = {
  weights: ScoringWeights
  mode: ScoringMode
  tolerance: ToleranceWindow
  graceful: boolean
}

export type StepBreakdown = {
  nodeId: string
  m: 0 | 0.5 | 1
  s: 0 | 1
  e: number
  expectedCarry: number
  actual: number
}

export type PscaResult = {
  score: number
  R: number
  S: number
  M: number
  E: number
  perStep: StepBreakdown[]
  awardedPoints: number
}

/** Input contract for `runPscaPipeline` — everything PSCA needs, nothing else. */
export type PscaScoreRequest = {
  /** Teacher model solution as a DAG of step nodes. */
  tree: readonly StepNode[]
  /** Committed student values keyed by `nodeId`. */
  studentAnswers: Readonly<Record<string, StudentStep>>
  /** Weights (`result` / `steps` / `method` / `errorFree`), `mode`, tolerance, `graceful`. */
  config: ScoringConfig
  /** Game maximum points; `awardedPoints = score × pointsMax`, clamped to `[0, pointsMax]`. */
  pointsMax: number
}
