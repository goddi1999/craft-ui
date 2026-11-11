import type { Deploy } from '@/components/ui/deploy-timeline'

const HOUR = 3_600_000

export const HISTORY: Deploy[] = [
  {
    id: 'v11',
    version: 'v11',
    kind: 'prompt',
    label: 'few-shot refresh',
    at: '2026-10-27T10:00:00Z',
    score: 0.904,
  },
  {
    id: 'v12',
    version: 'v12',
    kind: 'prompt',
    label: 'shorter system prompt',
    at: '2026-10-29T15:00:00Z',
    score: 0.912,
  },
  {
    id: 'o4-mini',
    version: 'o4-mini',
    kind: 'model',
    label: 'model swap',
    at: '2026-10-31T11:00:00Z',
    score: 0.921,
  },
  {
    id: 'v13',
    version: 'v13',
    kind: 'prompt',
    label: 'stricter escalation rules',
    at: '2026-11-02T14:20:00Z',
    score: 0.877,
    rolledBackAfter: 38,
  },
  {
    id: 'v14',
    version: 'v14',
    kind: 'prompt',
    label: 'escalation rules, take two',
    at: '2026-11-04T09:00:00Z',
    score: 0.931,
  },
]

export const CANARY_AT = Date.parse('2026-11-07T13:00:00Z')
export const END = Date.parse('2026-11-08T22:00:00Z')
export const RANGE: [string, string] = ['2026-10-26T12:00:00Z', '2026-11-09T00:00:00Z']

/** Canary beats: traffic share and the eval score it is settling on. */
const BEATS = [
  { at: 0, share: 0.01, score: 0.918 },
  { at: 0.22, share: 0.02, score: 0.941 },
  { at: 0.48, share: 0.05, score: 0.933 },
  { at: 0.74, share: 0.1, score: 0.936 },
]

/** The canary deploy and the clock ("now") at progress `p` (0 to 1). */
export function canaryAt(p: number) {
  // Ease the clock out so the canary arrives gently.
  const t = 1 - (1 - p) ** 2
  const now = CANARY_AT + 2 * HOUR + t * (END - CANARY_AT - 2 * HOUR)
  const beat = [...BEATS].reverse().find((b) => p >= b.at) ?? BEATS[0]
  const canary: Deploy = {
    id: 'v15',
    version: 'v15',
    kind: 'prompt',
    label: 'tool-use hints',
    at: CANARY_AT,
    score: beat.score,
    canary: beat.share,
  }
  return { now, canary }
}
