// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { EvalRacePosition, EvalRacer } from './eval-race.types'

const round = (n: number) => Math.round(n * 100) / 100
const sum = (xs: number[] = []) => xs.reduce((a, b) => a + b, 0)
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
const defaultFormatTime = (s: number) => `${s.toFixed(1)}s`

/** Stadium-shaped track: two straights and two half circles around (mid, cy). */
function stadium(width: number, height: number, margin: number) {
  const r = (height - 2 * margin) / 2
  const cy = height / 2
  const x0 = margin + r
  const x1 = width - margin - r
  const mid = width / 2
  const straight = Math.max(x1 - x0, 0)
  const arc = Math.PI * r
  const perimeter = 2 * straight + 2 * arc

  /** Point `laps` around, clockwise from the start line at the bottom centre. */
  const at = (laps: number, rad = r): [number, number] => {
    let s = (((laps % 1) + 1) % 1) * perimeter
    if (s < straight / 2) return [mid - s, cy + rad]
    s -= straight / 2
    if (s < arc) {
      const a = Math.PI / 2 + s / r
      return [x0 + rad * Math.cos(a), cy + rad * Math.sin(a)]
    }
    s -= arc
    if (s < straight) return [x0 + s, cy - rad]
    s -= straight
    if (s < arc) {
      const a = -Math.PI / 2 + s / r
      return [x1 + rad * Math.cos(a), cy + rad * Math.sin(a)]
    }
    return [x1 - (s - arc), cy + rad]
  }

  const path = (rad = r) => {
    const [a, b, c, d] = [mid, x0, x1, rad].map(round)
    const [top, bottom] = [round(cy - rad), round(cy + rad)]
    return `M${a} ${bottom}H${b}A${d} ${d} 0 0 1 ${b} ${top}H${c}A${d} ${d} 0 0 1 ${c} ${bottom}Z`
  }

  return { r, cy, mid, perimeter, at, path }
}

type Track = ReturnType<typeof stadium>

function rankRacers(
  racers: EvalRacer[],
  total: number,
  perLap: number,
  formatTime: (s: number) => string,
): EvalRacePosition[] {
  const laps = Math.ceil(total / perLap)
  const sorted = racers
    .map((r, i) => ({ r, i }))
    .sort((a, b) => b.r.scored - a.r.scored || sum(a.r.laps) - sum(b.r.laps) || a.i - b.i)
    .map(({ r }) => r)
  const lead = sorted[0]
  return sorted.map((r, rank) => {
    const behind = lead ? lead.scored - r.scored : 0
    const time = sum(r.laps) - sum(lead?.laps)
    const lapped = Math.floor(behind / perLap)
    const gap =
      rank === 0
        ? 'Leader'
        : lapped > 0
          ? `+${plural(lapped, 'lap')}`
          : behind > 0
            ? `+${behind}`
            : time > 0
              ? `+${formatTime(time)}`
              : '+0'
    return {
      ...r,
      rank,
      done: r.scored >= total,
      lap: Math.min(Math.floor(r.scored / perLap) + 1, laps),
      best: r.laps?.length ? Math.min(...r.laps) : null,
      last: r.laps?.length ? r.laps[r.laps.length - 1] : null,
      behind,
      gap,
    }
  })
}

export { defaultFormatTime, plural, rankRacers, round, stadium }
export type { Track }
