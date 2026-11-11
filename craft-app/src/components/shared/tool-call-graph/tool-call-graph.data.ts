import type { ToolCallNode } from '@/components/ui/tool-call-graph'

// Seeded noise so every render draws the same feed.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
}

export type Tool = ToolCallNode & { retries: number }

/** Where the 24 h window ends up; the feed counts its way here. */
export const FINAL: Tool[] = [
  {
    id: 'crm',
    label: 'crm.lookup',
    calls: 4820,
    p50Ms: 212,
    errorRate: 0.004,
    retries: 41,
  },
  {
    id: 'kb',
    label: 'kb.search',
    calls: 3910,
    p50Ms: 340,
    errorRate: 0.006,
    retries: 52,
  },
  {
    id: 'refund',
    label: 'refund.create',
    calls: 1240,
    p50Ms: 1800,
    errorRate: 0.029,
    retries: 96,
  },
  {
    id: 'email',
    label: 'email.send',
    calls: 1610,
    p50Ms: 420,
    errorRate: 0.001,
    retries: 12,
  },
  {
    id: 'calendar',
    label: 'calendar.book',
    calls: 900,
    p50Ms: 610,
    errorRate: 0.003,
    retries: 17,
  },
]

export const TICKS = 40
// The refund provider starts failing a third of the way in and settles high.
const SPIKE = [12, 20]

function simulate(): Tool[][] {
  const next = rng(11)
  // Uneven but monotonic: each tool's share of the remaining calls per tick.
  const steps = FINAL.map(() => Array.from({ length: TICKS }, () => 0.6 + next() * 0.8))
  const sums = steps.map((s) => s.reduce((a, b) => a + b, 0))
  const ramp = (k: number) =>
    Math.min(Math.max((k - SPIKE[0]) / (SPIKE[1] - SPIKE[0]), 0), 1)
  const ease = (x: number) => x * x * (3 - 2 * x)

  return Array.from({ length: TICKS + 1 }, (_, k) =>
    FINAL.map((t, i) => {
      const start = Math.round(t.calls * 0.95)
      const done = steps[i].slice(0, k).reduce((a, b) => a + b, 0) / sums[i]
      const calls = Math.round(start + (t.calls - start) * done)
      if (t.id !== 'refund') {
        return { ...t, calls, retries: Math.round(t.retries * (calls / t.calls)) }
      }
      const s = ease(ramp(k))
      return {
        ...t,
        calls,
        p50Ms: Math.round(1240 + (t.p50Ms - 1240) * s),
        errorRate: 0.005 + (t.errorRate - 0.005) * s,
        retries: Math.round(58 + (t.retries - 58) * s),
      }
    }),
  )
}

/** One snapshot of the tools per tick, from the start of the window to its end. */
export const FRAMES = simulate()
