// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
type EvalStatus = 'pending' | 'running' | 'pass' | 'fail' | 'regressed' | 'improved'

type EvalCase = {
  id: string
  name: string
  status: EvalStatus
  /** Grader score from 0 to 1. */
  score?: number
  input?: string
  expected?: string
  actual?: string
  /** Why the grader scored it this way. */
  reason?: string
}

type EvalMetric = {
  id: string
  label: string
  baseline: number
  candidate: number
  /** Which direction counts as an improvement. */
  better: 'higher' | 'lower'
  format?: (value: number) => string
}

type EvalFilter = 'all' | 'failed' | 'regressed' | 'improved'

type EvalResultsProps = {
  data: {
    suite: string
    /** e.g. "opus-5.5 vs sonnet-5.5". */
    label?: string
    cases: EvalCase[]
    /** Baseline pass rate (0–1) for the delta next to the big number. */
    baselinePassRate?: number
    metrics?: EvalMetric[]
  }
  /** `grid` shows every case; `compare` shows metrics and regressions. */
  view?: 'grid' | 'compare'
  filter?: EvalFilter
  onFilterChange?: (filter: EvalFilter) => void
  selectedId?: string | null
  onSelectCase?: (testCase: EvalCase) => void
  className?: string
}

export type { EvalCase, EvalFilter, EvalMetric, EvalResultsProps, EvalStatus }
