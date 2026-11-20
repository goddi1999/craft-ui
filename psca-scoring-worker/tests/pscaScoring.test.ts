import { describe, expect, it } from 'vitest'

import { DEFAULT_SCORING_CONFIG, R_ONLY_SCORING_CONFIG } from '../src/constants'
import { PscaValidationError } from '../src/errors'
import { methodScore } from '../src/psca/operatorMatch'
import { runPscaPipeline } from '../src/psca/pipeline'
import { pscaScore } from '../src/psca/pscaScoring'
import { topoSort, validateStepTree } from '../src/psca/stepTree'
import { computeTolerance } from '../src/psca/toleranceWindow'
import type { ScoringConfig, StepNode, StudentStep } from '../src/schemas'

const LOHNKOSTEN_TREE: StepNode[] = [
  {
    id: 'n1',
    operator: '×',
    operands: [6, 18.5],
    expected: 111,
    unit: '€',
    deps: [],
  },
  {
    id: 'n2',
    operator: '×',
    operands: [2, 12, 4.75],
    expected: 114,
    unit: '€',
    deps: [],
  },
  {
    id: 'n3',
    operator: 'Σ',
    operands: [{ ref: 'n1' }, { ref: 'n2' }],
    expected: 225,
    unit: '€',
    deps: ['n1', 'n2'],
  },
  {
    id: 'n4',
    operator: '×',
    operands: [{ ref: 'n3' }, 1.72],
    expected: 387,
    unit: '€',
    deps: ['n3'],
  },
  {
    id: 'n5',
    operator: 'Σ',
    operands: [{ ref: 'n3' }, { ref: 'n4' }],
    expected: 612,
    unit: '€',
    deps: ['n3', 'n4'],
  },
]

const STUDENT_WITH_N2_ERROR: Record<string, StudentStep> = {
  n1: {
    nodeId: 'n1',
    operator: '×',
    operands: [6, 18.5],
    actual: 111,
    unit: '€',
    notation: { decimal: 'comma', rounded: false },
  },
  n2: {
    nodeId: 'n2',
    operator: '×',
    operands: [2, 12, 4.75],
    actual: 100,
    unit: '€',
    notation: { decimal: 'comma', rounded: false },
  },
  n3: {
    nodeId: 'n3',
    operator: 'Σ',
    operands: [{ ref: 'n1' }, { ref: 'n2' }],
    actual: 211,
    unit: '€',
    notation: { decimal: 'comma', rounded: false },
  },
  n4: {
    nodeId: 'n4',
    operator: '×',
    operands: [{ ref: 'n3' }, 1.72],
    actual: 362.92,
    unit: '€',
    notation: { decimal: 'comma', rounded: false },
  },
  n5: {
    nodeId: 'n5',
    operator: 'Σ',
    operands: [{ ref: 'n3' }, { ref: 'n4' }],
    actual: 573.92,
    unit: '€',
    notation: { decimal: 'comma', rounded: false },
  },
}

describe('psca scoring core', () => {
  it('validates step tree and sorts by deps', () => {
    expect(() => validateStepTree(LOHNKOSTEN_TREE)).not.toThrow()
    const ordered = topoSort(LOHNKOSTEN_TREE)
    expect(ordered.map((node) => node.id)).toEqual(['n1', 'n2', 'n3', 'n4', 'n5'])
  })

  it('computes tolerance window as max(abs, rel*|expected|)', () => {
    expect(computeTolerance(387, { abs: 0.01, rel: 0.001 })).toBe(0.387)
    expect(computeTolerance(2, { abs: 0.01, rel: 0.001 })).toBe(0.01)
  })

  it('scores related operator Σ and + as 0.5', () => {
    expect(methodScore('Σ', '+')).toBe(0.5)
    expect(methodScore('+', 'Σ')).toBe(0.5)
    expect(methodScore('×', '×')).toBe(1)
    expect(methodScore('÷', '×')).toBe(0)
  })

  it('matches worked example shape in carry mode (~0.44 with current E-subscore defaults)', () => {
    const result = pscaScore(LOHNKOSTEN_TREE, STUDENT_WITH_N2_ERROR, DEFAULT_SCORING_CONFIG, 10)
    expect(result.R).toBe(0)
    expect(result.S).toBe(0.8)
    expect(result.M).toBe(1)
    expect(result.score).toBeCloseTo(0.44, 2)
    expect(result.awardedPoints).toBeCloseTo(4.4, 1)
  })

  it('scores strict mode lower (~0.26 with current E-subscore defaults)', () => {
    const strictConfig: ScoringConfig = {
      ...DEFAULT_SCORING_CONFIG,
      mode: 'strict',
    }
    const result = pscaScore(LOHNKOSTEN_TREE, STUDENT_WITH_N2_ERROR, strictConfig, 10)
    expect(result.score).toBeCloseTo(0.26, 2)
  })

  it('supports R-only config for single-step MVP', () => {
    const singleNodeTree: StepNode[] = [
      { id: 'final', operator: 'Σ', operands: [111], expected: 111, unit: '€', deps: [] },
    ]
    const correctAnswer: Record<string, StudentStep> = {
      final: {
        nodeId: 'final',
        operator: 'Σ',
        operands: [111],
        actual: 111,
        unit: '€',
        notation: { decimal: 'comma', rounded: false },
      },
    }

    const result = pscaScore(singleNodeTree, correctAnswer, R_ONLY_SCORING_CONFIG, 10)
    expect(result.score).toBe(1)
    expect(result.awardedPoints).toBe(10)
  })
})

describe('runPscaPipeline', () => {
  it('scores the Lohnkosten worked example (Notion §10: score ≈ 0.437, ≈ 4.37 points at P_max = 10)', () => {
    const result = runPscaPipeline({
      tree: LOHNKOSTEN_TREE,
      studentAnswers: STUDENT_WITH_N2_ERROR,
      config: DEFAULT_SCORING_CONFIG,
      pointsMax: 10,
    })
    expect(result.R).toBe(0)
    expect(result.S).toBe(0.8)
    expect(result.M).toBe(1)
    expect(result.score).toBeCloseTo(0.437, 2)
    expect(result.awardedPoints).toBeCloseTo(4.37, 1)
    expect(result.perStep).toHaveLength(5)
    expect(result.perStep.map((step) => step.nodeId)).toEqual(['n1', 'n2', 'n3', 'n4', 'n5'])
  })

  it('is deterministic: same request produces the same result', () => {
    const request = {
      tree: LOHNKOSTEN_TREE,
      studentAnswers: STUDENT_WITH_N2_ERROR,
      config: DEFAULT_SCORING_CONFIG,
      pointsMax: 10,
    }
    expect(runPscaPipeline(request)).toEqual(runPscaPipeline(request))
  })

  it('returns a zero result for an empty tree instead of throwing', () => {
    const result = runPscaPipeline({
      tree: [],
      studentAnswers: {},
      config: DEFAULT_SCORING_CONFIG,
      pointsMax: 10,
    })
    expect(result.score).toBe(0)
    expect(result.awardedPoints).toBe(0)
    expect(result.perStep).toEqual([])
  })

  it('throws PscaValidationError with INVALID_STEP_TREE for unknown deps', () => {
    const brokenTree: StepNode[] = [
      { id: 'a', operator: '+', operands: [1, 2], expected: 3, unit: '', deps: ['missing'] },
    ]
    const run = () =>
      runPscaPipeline({
        tree: brokenTree,
        studentAnswers: {},
        config: DEFAULT_SCORING_CONFIG,
        pointsMax: 10,
      })
    expect(run).toThrow(PscaValidationError)
    try {
      run()
    } catch (error) {
      expect((error as PscaValidationError).code).toBe('INVALID_STEP_TREE')
    }
  })

  it('throws PscaValidationError with INVALID_STEP_TREE for cyclic trees', () => {
    const cyclicTree: StepNode[] = [
      { id: 'a', operator: '+', operands: [{ ref: 'b' }], expected: 1, unit: '', deps: ['b'] },
      { id: 'b', operator: '+', operands: [{ ref: 'a' }], expected: 1, unit: '', deps: ['a'] },
    ]
    expect(() =>
      runPscaPipeline({
        tree: cyclicTree,
        studentAnswers: {},
        config: DEFAULT_SCORING_CONFIG,
        pointsMax: 10,
      }),
    ).toThrow(PscaValidationError)
  })

  it('clamps awardedPoints to 0 when pointsMax <= 0 without throwing', () => {
    const result = runPscaPipeline({
      tree: LOHNKOSTEN_TREE,
      studentAnswers: STUDENT_WITH_N2_ERROR,
      config: DEFAULT_SCORING_CONFIG,
      pointsMax: -5,
    })
    expect(result.awardedPoints).toBe(0)
    expect(result.score).toBeCloseTo(0.44, 2)
  })

  it('treats a missing student answer as s = 0, m = 0, e = 0 for that step', () => {
    const partialAnswers = Object.fromEntries(
      Object.entries(STUDENT_WITH_N2_ERROR).filter(([nodeId]) => nodeId !== 'n5'),
    )
    const result = runPscaPipeline({
      tree: LOHNKOSTEN_TREE,
      studentAnswers: partialAnswers,
      config: DEFAULT_SCORING_CONFIG,
      pointsMax: 10,
    })
    const finalStep = result.perStep.find((step) => step.nodeId === 'n5')
    expect(finalStep).toMatchObject({ m: 0, s: 0, e: 0 })
    expect(finalStep?.actual).toBeNaN()
  })
})
