/**
 * PSCA, the Partial Scoring Carry Algorithm, and the adapter from canvas rows to its steps.
 *
 *   score = w_R·R + w_S·S + w_M·M + w_E·E          (weights sum to 1)
 *   points = score × maxPoints                        (clamped to [0, maxPoints])
 *
 * R  final answer within tolerance ε = max(abs, rel·|expected|); with `graceful`,
 *    1 − |Δ| / |expected| instead of 0 when it's off
 * S  share of steps whose value is within ε of the carry-resolved expectation
 * M  share of steps with the right operator (`Σ` against `+` earns half)
 * E  per step, the average of unit, notation and sign checks
 *
 * Ported from `@wq/psca-scoring`. Steps are independent here (no operand references), as in the
 * source canvas adapter, so `carry` and `strict` score the same until steps reference each other.
 */

import type { DnDMathOperator, DnDMathScoringMode } from './dnd-math.types'

export type PscaWeights = { result: number; steps: number; method: number; errorFree: number }
export type PscaTolerance = { abs: number; rel: number }
export type PscaConfig = {
  weights: PscaWeights
  mode: DnDMathScoringMode
  tolerance: PscaTolerance
  graceful: boolean
}

export type StepNode = {
  id: string
  operator: DnDMathOperator
  /** A number, or `{ ref }` to another step's result. */
  operands: Array<number | { ref: string }>
  expected: number
  unit: string
  deps: string[]
}

export type StudentStep = {
  nodeId: string
  operator: DnDMathOperator
  operands: Array<number | { ref: string }>
  actual: number
  unit: string
  notation: { decimal: 'comma' | 'dot'; rounded: boolean }
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

export const FULL_WEIGHTS: PscaWeights = { result: 0.5, steps: 0.3, method: 0.15, errorFree: 0.05 }
export const RESULT_WEIGHTS: PscaWeights = { result: 1, steps: 0, method: 0, errorFree: 0 }
export const DEFAULT_TOLERANCE: PscaTolerance = { abs: 0.01, rel: 0.001 }

/** ε = max(abs, rel · |expected|) */
export const computeTolerance = (expected: number, tolerance: PscaTolerance) =>
  Math.max(tolerance.abs, tolerance.rel * Math.abs(expected))

/** Orders steps so each comes after its dependencies. Throws on an unknown dep or a cycle. */
export function topoSort(tree: readonly StepNode[]): StepNode[] {
  const byId = new Map(tree.map((node) => [node.id, node]))
  const ordered: StepNode[] = []
  const state = new Map<string, 'visiting' | 'done'>()
  const visit = (node: StepNode) => {
    if (state.get(node.id) === 'done') return
    if (state.get(node.id) === 'visiting') throw new Error('Cyclic step tree')
    state.set(node.id, 'visiting')
    for (const dep of node.deps) {
      const depNode = byId.get(dep)
      if (!depNode) throw new Error(`Unknown dep: ${dep}`)
      visit(depNode)
    }
    state.set(node.id, 'done')
    ordered.push(node)
  }
  tree.forEach(visit)
  return ordered
}

function computeByOperator(operator: DnDMathOperator, operands: readonly number[]): number {
  const [first = 0, ...rest] = operands
  if (operator === '+' || operator === 'Σ') return operands.reduce((a, b) => a + b, 0)
  if (operator === '×') return operands.reduce((a, b) => a * b, 1)
  if (operator === '−') return rest.reduce((a, b) => a - b, first)
  return rest.reduce((a, b) => a / b, first)
}

/** `carry` takes a referenced step from the student's answer, `strict` from the solution. */
function resolveOperands(
  node: StepNode,
  mode: DnDMathScoringMode,
  byId: ReadonlyMap<string, StepNode>,
  answers: Readonly<Record<string, StudentStep>>,
): number[] {
  return node.operands.map((operand) => {
    if (typeof operand === 'number') return operand
    const ref = byId.get(operand.ref)
    if (!ref) return 0
    if (mode === 'strict') return ref.expected
    return answers[operand.ref]?.actual ?? ref.expected
  })
}

const methodScore = (student: DnDMathOperator | undefined, expected: DnDMathOperator) => {
  if (!student) return 0
  if (student === expected) return 1
  const related = (student === 'Σ' && expected === '+') || (student === '+' && expected === 'Σ')
  return related ? 0.5 : 0
}

function errorFreeScore(student: StudentStep | undefined, expected: StepNode): number {
  if (!student) return 0
  const unit = student.unit.trim() === expected.unit.trim() ? 1 : 0
  const notation = student.notation.decimal === 'comma' ? 1 : 0.5
  const plausible =
    Number.isFinite(student.actual) && !(student.actual < 0 && expected.expected >= 0)
  return (unit + notation + (plausible ? 1 : 0)) / 3
}

function resultScore(
  expected: number,
  actual: number | undefined,
  epsilon: number,
  graceful: boolean,
) {
  if (actual === undefined || !Number.isFinite(actual)) return 0
  const delta = Math.abs(actual - expected)
  if (delta <= epsilon) return 1
  if (!graceful || expected === 0) return 0
  return Math.max(0, 1 - delta / Math.abs(expected))
}

/**
 * Scores a solution tree against the student's steps. Deterministic. An empty tree scores 0;
 * a missing answer scores 0 on that step; points are clamped to `[0, pointsMax]`.
 */
export function runPsca(
  tree: readonly StepNode[],
  answers: Readonly<Record<string, StudentStep>>,
  config: PscaConfig,
  pointsMax: number,
): PscaResult {
  if (tree.length === 0) return { score: 0, R: 0, S: 0, M: 0, E: 0, perStep: [], awardedPoints: 0 }
  const { weights, tolerance } = config
  if (Math.abs(weights.result + weights.steps + weights.method + weights.errorFree - 1) > 1e-9) {
    throw new Error('Weights must sum to 1')
  }

  const ordered = topoSort(tree)
  const byId = new Map(ordered.map((node) => [node.id, node]))
  const perStep = ordered.map((node): StepBreakdown => {
    const student = answers[node.id]
    const expectedCarry = computeByOperator(
      node.operator,
      resolveOperands(node, config.mode, byId, answers),
    )
    const epsilon = computeTolerance(expectedCarry, tolerance)
    const within =
      student &&
      Number.isFinite(student.actual) &&
      Math.abs(student.actual - expectedCarry) <= epsilon
    return {
      nodeId: node.id,
      m: methodScore(student?.operator, node.operator),
      s: within ? 1 : 0,
      e: errorFreeScore(student, node),
      expectedCarry,
      actual: student?.actual ?? Number.NaN,
    }
  })

  const average = (pick: (step: StepBreakdown) => number) =>
    perStep.reduce((sum, step) => sum + pick(step), 0) / perStep.length
  const final = ordered[ordered.length - 1]
  const R = resultScore(
    final.expected,
    answers[final.id]?.actual,
    computeTolerance(final.expected, tolerance),
    config.graceful,
  )
  const S = average((step) => step.s)
  const M = average((step) => step.m)
  const E = average((step) => step.e)
  const score = weights.result * R + weights.steps * S + weights.method * M + weights.errorFree * E
  const max = Math.max(0, pointsMax)
  return { score, R, S, M, E, perStep, awardedPoints: Math.min(Math.max(score * max, 0), max) }
}

/** One worked-out step, from the solution or from a canvas row. */
export type ScoringStep = {
  id: string
  value: number
  unit: string
  operator: DnDMathOperator
}

const within = (a: number, b: number, tolerance: PscaTolerance) =>
  Number.isFinite(a) && Math.abs(a - b) <= computeTolerance(b, tolerance)

/**
 * Pairs each solution step with at most one student step: first by operator and value (so
 * reordered rows still match), then by position among what's left (so a wrong value still
 * lines up with its step).
 */
export function alignSteps(
  solution: readonly ScoringStep[],
  student: readonly ScoringStep[],
  tolerance: PscaTolerance,
): Map<string, ScoringStep> {
  const matches = new Map<string, ScoringStep>()
  const used = new Set<number>()
  for (const step of solution) {
    const index = student.findIndex(
      (s, i) =>
        !used.has(i) && s.operator === step.operator && within(s.value, step.value, tolerance),
    )
    if (index >= 0) {
      matches.set(step.id, student[index])
      used.add(index)
    }
  }
  solution.forEach((step, index) => {
    if (matches.has(step.id) || index >= student.length || used.has(index)) return
    matches.set(step.id, student[index])
    used.add(index)
  })
  return matches
}

/** Builds the PSCA inputs from solution and student steps and scores them. */
export function scoreSteps(
  solution: readonly ScoringStep[],
  student: readonly ScoringStep[],
  config: PscaConfig,
  pointsMax: number,
) {
  const matches = alignSteps(solution, student, config.tolerance)
  const tree: StepNode[] = solution.map((step) => ({
    id: step.id,
    operator: step.operator,
    operands: [step.value],
    expected: step.value,
    unit: step.unit,
    deps: [],
  }))
  const answers: Record<string, StudentStep> = {}
  for (const [id, step] of matches) {
    answers[id] = {
      nodeId: id,
      operator: step.operator,
      operands: [step.value],
      actual: step.value,
      unit: step.unit,
      notation: { decimal: 'comma', rounded: false },
    }
  }
  return { result: runPsca(tree, answers, config, pointsMax), matches }
}
