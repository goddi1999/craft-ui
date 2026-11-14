import { evaluateEquation, formatPlain, withUnit } from './dnd-math.engine'
import {
  DEFAULT_TOLERANCE,
  FULL_WEIGHTS,
  RESULT_WEIGHTS,
  scoreSteps,
  type ScoringStep,
} from './dnd-math.scoring'
import type {
  DnDMathEquationRow,
  DnDMathMark,
  DnDMathProps,
  DnDMathRow,
  DnDMathScore,
  DnDMathSumRow,
  DnDMathValue,
} from './dnd-math.types'

export const createId = () => Math.random().toString(36).slice(2, 10)

export const createEquationRow = (input = ''): DnDMathEquationRow => ({
  id: createId(),
  kind: 'equation',
  input,
  status: 'draft',
})

export const createSumRow = (): DnDMathSumRow => ({ id: createId(), kind: 'sum', items: [] })

/** Works out what the student typed. Empty input goes back to a draft. */
export function solveRow(row: DnDMathEquationRow, input: string): DnDMathEquationRow {
  const text = input.trim()
  if (text.length === 0) return { id: row.id, kind: 'equation', input: '', status: 'draft' }
  const outcome = evaluateEquation(text)
  // narrowed with `in`: the app compiles without strictNullChecks, where `ok` doesn't narrow
  if ('message' in outcome) {
    return { id: row.id, kind: 'equation', input: text, status: 'error', message: outcome.message }
  }
  const { expression, value, unit, category, operator } = outcome
  return {
    id: row.id,
    kind: 'equation',
    input: expression,
    status: 'solved',
    result: { value, unit, category, operator },
  }
}

export function sumTotal(row: DnDMathSumRow): DnDMathValue | null {
  const [first] = row.items
  if (!first) return null
  const value = row.items.reduce((total, item) => total + item.value, 0)
  return { value: Math.round(value * 1e10) / 1e10, unit: first.unit, category: first.category }
}

/** The value a row hands on: an equation's result or a sum's total. */
export function rowValue(row: DnDMathRow): DnDMathValue | null {
  if (row.kind === 'sum') return sumTotal(row)
  return row.status === 'solved' && row.result ? row.result : null
}

/** A carried value as typeable text: `340 €` → `340 €`, `81.6` → `81,6` in de-DE. */
export const carryText = (value: DnDMathValue, locale: string) =>
  withUnit(formatPlain(value.value, locale), value.unit)

/** Adds a result to a sum row, or says why it can't go in. */
export function addToSum(
  row: DnDMathSumRow,
  value: DnDMathValue,
): { ok: true; row: DnDMathSumRow } | { ok: false; message: string } {
  const [first] = row.items
  if (first && (first.category !== value.category || first.unit !== value.unit)) {
    const allowed = first.unit || 'plain numbers'
    return { ok: false, message: `Only ${allowed} can go in this sum.` }
  }
  return {
    ok: true,
    row: { ...row, message: undefined, items: [...row.items, { ...value, id: createId() }] },
  }
}

/** Solved equations and filled sums, in canvas order, as scoring steps. */
export function rowsToSteps(rows: readonly DnDMathRow[]): ScoringStep[] {
  return rows.flatMap((row): ScoringStep[] => {
    const value = rowValue(row)
    if (!value) return []
    const operator = row.kind === 'sum' ? 'Σ' : (row.result?.operator ?? '×')
    return [{ id: row.id, value: value.value, unit: value.unit, operator }]
  })
}

/** Works out each solution equation; any that don't evaluate are left out. */
export function solutionToSteps(solution: readonly string[]): ScoringStep[] {
  return solution.flatMap((equation, index): ScoringStep[] => {
    const outcome = evaluateEquation(equation)
    if ('message' in outcome) {
      if (import.meta.env.DEV)
        console.warn(`DnDMath: solution step “${equation}”: ${outcome.message}`)
      return []
    }
    return [
      { id: `step-${index}`, value: outcome.value, unit: outcome.unit, operator: outcome.operator },
    ]
  })
}

type ScoreOptions = Required<Pick<DnDMathProps, 'points' | 'weighting' | 'mode' | 'graceful'>>

/** PSCA over the canvas. `null` when there's nothing to compare. */
export function scoreRows(
  rows: readonly DnDMathRow[],
  solution: readonly string[],
  { points, weighting, mode, graceful }: ScoreOptions,
): DnDMathScore | null {
  const expected = solutionToSteps(solution)
  const student = rowsToSteps(rows)
  if (expected.length === 0 || student.length === 0) return null

  const config = {
    weights: weighting === 'result' ? RESULT_WEIGHTS : FULL_WEIGHTS,
    mode,
    tolerance: DEFAULT_TOLERANCE,
    graceful,
  }
  const { result, matches } = scoreSteps(expected, student, config, points)

  const marks: Record<string, DnDMathMark> = {}
  for (const step of result.perStep) {
    const matched = matches.get(step.nodeId)
    if (matched) marks[matched.id] = step.s === 1 ? 'correct' : 'wrong'
  }
  return {
    points: Math.round(result.awardedPoints * 100) / 100,
    maxPoints: points,
    score: result.score,
    result: result.R,
    steps: result.S,
    method: result.M,
    errorFree: result.E,
    marks,
    missing: expected.length - matches.size,
  }
}
