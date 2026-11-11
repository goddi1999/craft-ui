import type { UsageDay, UsageModel } from '@/components/ui/usage-summary'

export const MODELS: UsageModel[] = [
  { id: 'opus', name: 'Claude Opus 5.5' },
  { id: 'sonnet', name: 'Claude Sonnet 5.5' },
  { id: 'haiku', name: 'Claude Haiku 5.5' },
]

// Rough $ per 1k tokens, blended input/output.
const PRICE: Record<string, number> = { opus: 0.03, sonnet: 0.008, haiku: 0.002 }

/** Latest day of the sample data. */
const END = Date.UTC(2026, 10, 3)
const DAY_MS = 86_400_000

/**
 * Deterministic, weekday-heavy usage. `endOffset` shifts the window back in
 * time, so the previous period is the same generator one window earlier.
 * No randomness: the same call always gives the same days.
 */
export function makeDays(count: number, endOffset = 0): UsageDay[] {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(END - (endOffset + count - 1 - i) * DAY_MS)
    const weekend = [0, 6].includes(date.getUTCDay())
    const seed = i + endOffset
    const wave = 0.6 + (((seed * 37) % 11) / 11) * 0.8
    const scale = (weekend ? 0.35 : 1) * wave
    const tokens: Record<string, number> = {
      opus: Math.round(310_000 * scale * (seed % 3 === 0 ? 1.4 : 0.8)),
      sonnet: Math.round(1_150_000 * scale),
      haiku: Math.round(2_400_000 * scale * (seed % 4 === 1 ? 0.5 : 1)),
    }
    return {
      date: date.toISOString().slice(0, 10),
      byModel: Object.fromEntries(
        Object.entries(tokens).map(([id, t]) => [
          id,
          { tokens: t, cost: (t / 1000) * PRICE[id] },
        ]),
      ),
    }
  })
}

export const totalCost = (days: UsageDay[]) =>
  days.reduce(
    (n, d) => n + Object.values(d.byModel).reduce((m, v) => m + v.cost, 0),
    0,
  )
