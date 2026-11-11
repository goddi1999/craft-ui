import type { EvalCase, EvalMetric, EvalStatus } from '@/components/ui/eval-results'

const TABLES = ['orders', 'customers', 'invoices', 'events', 'sessions', 'products']
const ASKS = [
  'Top 5 customers by revenue last quarter',
  'Daily active sessions for the past week',
  'Orders with no matching invoice',
  'Median order value by country',
  'Products never ordered',
  'Events per user, bucketed by hour',
]

const COUNT = 60
const BATCH = 4

// Deterministic spread: mostly passes, a few failures, regressions and wins.
const finalStatus = (i: number): EvalStatus =>
  [7, 23, 41].includes(i)
    ? 'regressed'
    : [12, 35, 50, 57].includes(i)
      ? 'fail'
      : [4, 29, 46].includes(i)
        ? 'improved'
        : 'pass'

const makeCase = (i: number, status: EvalStatus): EvalCase => {
  const table = TABLES[i % TABLES.length]
  const bad = finalStatus(i) === 'fail' || finalStatus(i) === 'regressed'
  return {
    id: `case-${i}`,
    name: `sql/${table}-${String(i + 1).padStart(2, '0')}`,
    status,
    score: bad ? 0.2 + (i % 3) * 0.1 : 0.9 + (i % 2) * 0.1,
    input: ASKS[i % ASKS.length],
    expected: `SELECT … FROM ${table} GROUP BY 1 ORDER BY 2 DESC LIMIT 5;`,
    actual: bad
      ? `SELECT … FROM ${table} ORDER BY 2 DESC;`
      : `SELECT … FROM ${table} GROUP BY 1 ORDER BY 2 DESC LIMIT 5;`,
    reason: bad
      ? 'Missing GROUP BY: the query returns one row per order instead of per customer.'
      : 'Result set matches the reference on the fixture database.',
  }
}

/**
 * The cases at a given step of the run. Batches of four start running, then
 * resolve, so step `2n` has n batches done and step `2n + 1` has one running.
 */
function casesAt(step: number): EvalCase[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const batch = Math.floor(i / BATCH)
    const done = Math.floor(step / 2)
    const status: EvalStatus =
      batch < done ? finalStatus(i) : batch === done && step % 2 === 1 ? 'running' : 'pending'
    return makeCase(i, status)
  })
}

const STEPS = (COUNT / BATCH) * 2

const METRICS: EvalMetric[] = [
  {
    id: 'acc',
    label: 'Exact-match accuracy',
    baseline: 0.849,
    candidate: 0.883,
    better: 'higher',
    format: (v) => `${(v * 100).toFixed(1)}%`,
  },
  {
    id: 'p50',
    label: 'Latency p50',
    baseline: 1840,
    candidate: 1320,
    better: 'lower',
    format: (v) => `${(v / 1000).toFixed(2)}s`,
  },
  {
    id: 'cost',
    label: 'Cost per case',
    baseline: 0.0042,
    candidate: 0.0051,
    better: 'lower',
    format: (v) => `$${v.toFixed(4)}`,
  },
  { id: 'refusals', label: 'Refusals', baseline: 3, candidate: 1, better: 'lower' },
]

export { METRICS, STEPS, casesAt }
