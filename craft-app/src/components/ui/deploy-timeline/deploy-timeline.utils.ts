// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type {
  Deploy,
  DeployItem,
  DeployStatus,
  ScoreSegment,
} from './deploy-timeline.types'

export const round = (n: number) => Math.round(n * 100) / 100
export const ms = (v: Date | string | number) =>
  typeof v === 'number' ? v : v instanceof Date ? v.getTime() : new Date(v).getTime()

const utcDay = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})
export const defaultDate = (date: Date) => utcDay.format(date)
export const defaultScore = (score: number) => score.toFixed(3)

/** Delta in points with a real minus sign: "−4.4 pts". */
export function points(delta: number) {
  const p = Math.round(delta * 1000) / 10
  if (p === 0) return '±0 pts'
  return `${p < 0 ? '−' : '+'}${Math.abs(p).toFixed(1)} pts`
}

export function duration(minutes: number) {
  if (minutes < 60) return `${Math.round(minutes)} min`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m ? `${h} h ${m} min` : `${h} h`
}

export const percent = (share: number) => `${Math.round(share * 100)}%`

/** Walks the deploys in order and works out what was live when. */
export function analyze(deploys: Deploy[], threshold: number | undefined, now: number) {
  const sorted = [...deploys]
    .map((d) => ({ d, at: ms(d.at) }))
    .sort((a, b) => a.at - b.at)
  const main = sorted.filter((x) => x.d.canary === undefined)
  const canary = sorted.filter((x) => x.d.canary !== undefined).at(-1)

  const segments: ScoreSegment[] = []
  const before = new Map<string, number | null>()
  let good: (typeof main)[number] | undefined
  main.forEach((x, i) => {
    const next = Math.min(main[i + 1]?.at ?? now, now)
    before.set(x.d.id, good?.d.score ?? null)
    if (x.d.rolledBackAfter !== undefined) {
      const back = x.at + x.d.rolledBackAfter * 60_000
      segments.push({
        owner: x.d.id,
        from: x.at,
        to: Math.min(back, next),
        score: x.d.score,
        regression: true,
      })
      // The previous version takes the traffic back.
      if (good && back < next)
        segments.push({
          owner: good.d.id,
          from: back,
          to: next,
          score: good.d.score,
          regression: false,
        })
    } else {
      segments.push({
        owner: x.d.id,
        from: x.at,
        to: next,
        score: x.d.score,
        regression: threshold !== undefined && x.d.score < threshold,
      })
      good = x
    }
  })
  const live = good?.d
  if (canary) before.set(canary.d.id, live?.score ?? null)

  const items: DeployItem[] = sorted.map(({ d, at }) => {
    const rolled = d.rolledBackAfter !== undefined
    const below = threshold !== undefined && d.score < threshold
    const status: DeployStatus =
      d.id === canary?.d.id
        ? 'canary'
        : d.id === live?.id
          ? 'live'
          : rolled
            ? 'rolled-back'
            : below
              ? 'below'
              : 'shipped'
    return {
      d,
      at,
      status,
      before: before.get(d.id) ?? null,
      regression: rolled || below,
    }
  })

  // The last good deploy before live: the default target for compare and roll back.
  const goodOnes = items.filter(
    (x) => x.d.canary === undefined && !x.regression && x.d.id !== live?.id,
  )
  const previous = goodOnes.filter((x) => !live || x.at < ms(live.at)).at(-1)?.d

  return { items, segments, live, canary: canary?.d, previous }
}
