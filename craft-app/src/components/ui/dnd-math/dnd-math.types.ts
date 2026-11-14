import type { Ref } from 'react'

import type { UnitCategory } from './dnd-math.units'

/** A step's method, as PSCA compares it. `Σ` is a sum row and earns half credit against `+`. */
export type DnDMathOperator = '×' | '+' | '−' | '÷' | 'Σ'

/** A worked-out value: what a result chip shows and what gets carried on. */
export type DnDMathValue = {
  value: number
  /** Display unit, `''` for a plain number. */
  unit: string
  category: UnitCategory
}

export type DnDMathEquationRow = {
  id: string
  kind: 'equation'
  /** What the student typed (or the tidied equation after Enter). */
  input: string
  status: 'draft' | 'solved' | 'error'
  /** Set while solved. */
  result?: DnDMathValue & { operator: DnDMathOperator }
  /** Why the last Enter failed. */
  message?: string
}

export type DnDMathSumItem = DnDMathValue & { id: string }

export type DnDMathSumRow = {
  id: string
  kind: 'sum'
  /** Results dropped in; all share the first one's unit. */
  items: DnDMathSumItem[]
  message?: string
}

export type DnDMathRow = DnDMathEquationRow | DnDMathSumRow

export type DnDMathBlock = 'equation' | 'sum'

export type DnDMathMark = 'correct' | 'wrong'

export type DnDMathScoringMode = 'carry' | 'strict'

/** The PSCA result of a check, in points and per component (each 0–1). */
export type DnDMathScore = {
  points: number
  maxPoints: number
  /** Weighted total, 0–1. */
  score: number
  /** Final answer matches the solution. */
  result: number
  /** Share of steps whose value is right. */
  steps: number
  /** Share of steps with the right operation. */
  method: number
  /** Units, notation and sign. */
  errorFree: number
  /** Which rows were right or wrong, by row id. */
  marks: Record<string, DnDMathMark>
  /** Solution steps nothing on the canvas matched. */
  missing: number
}

export type DnDMathHandle = {
  /** Scores the canvas against `solution`. `null` without a solution or with nothing solved. */
  check: () => DnDMathScore | null
  /** Clears the canvas. */
  reset: () => void
}

export type DnDMathProps = {
  /** Model solution, one equation per step, e.g. `['40 × 8,50 €', '340 € × 19 %']`. */
  solution?: readonly string[]
  /** Points for a perfect answer. @default 10 */
  points?: number
  /**
   * `'full'`: 50 % result, 30 % steps, 15 % method, 5 % error-free. `'result'`: only the final
   * answer counts. @default 'full'
   */
  weighting?: 'full' | 'result'
  /** `carry`: a step built on an earlier wrong result is still judged on its own working. @default 'carry' */
  mode?: DnDMathScoringMode
  /** A wrong final answer earns partial credit by how far off it is. @default false */
  graceful?: boolean
  /** Number formatting and the decimal mark carried values are typed with. @default 'de-DE' */
  locale?: string
  /** Equations on the canvas at the start. They are worked out straight away. */
  defaultRows?: readonly string[]
  /** Called on every change to the canvas. */
  onRowsChange?: (rows: DnDMathRow[]) => void
  /** Called after Check with the score. */
  onCheck?: (score: DnDMathScore) => void
  /** Show the Check button (only when there is a `solution`). @default true */
  showCheck?: boolean
  /** Freeze the canvas: no drags, edits or checks. @default false */
  disabled?: boolean
  className?: string
  ref?: Ref<DnDMathHandle>
}
