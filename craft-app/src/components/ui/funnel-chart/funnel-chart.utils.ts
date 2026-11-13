import { LAYOUT, MIN_BAR, RAMP } from './funnel-chart.constants'
import type { FunnelStage } from './funnel-chart.types'

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

export const defaultFormat = (n: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n)

export const pctText = (n: number) => `${n.toFixed(n >= 10 || n === 0 ? 0 : 1)}%`

export const stageColor = (stages: FunnelStage[], i: number) => {
  const n = stages.length
  if (stages[i].color) return stages[i].color
  const t = n > 1 ? Math.round((i / (n - 1)) * 100) : 0
  return `color-mix(in oklch, ${RAMP.from}, ${RAMP.to} ${t}%)`
}

export const blockHeight = () => LAYOUT.text + LAYOUT.bar + LAYOUT.bridge

export const chartHeight = (n: number) =>
  n * (LAYOUT.text + LAYOUT.bar) + Math.max(0, n - 1) * LAYOUT.bridge

export const barWidth = (value: number, maxV: number, width: number) =>
  clamp((width * Math.max(0, value)) / maxV, MIN_BAR, width)

export const barX = (value: number, maxV: number, width: number) =>
  (width - barWidth(value, maxV, width)) / 2

export const ofTop = (value: number, top: number) => (value / top) * 100

export const dropPct = (from: number, to: number) => (from > 0 ? (1 - to / from) * 100 : 0)

/** Curved band connecting stage `i` to `i + 1`. */
export const bridgePath = (stages: FunnelStage[], i: number, width: number, maxV: number) => {
  const block = blockHeight()
  const yb = i * block + LAYOUT.text + LAYOUT.bar
  const w1 = barWidth(stages[i].value, maxV, width)
  const w2 = barWidth(stages[i + 1].value, maxV, width)
  const l1 = (width - w1) / 2
  const r1 = l1 + w1
  const l2 = (width - w2) / 2
  const r2 = l2 + w2
  const m = LAYOUT.bridge / 2
  return `M${l1} ${yb}L${r1} ${yb}C${r1} ${yb + m} ${r2} ${yb + m} ${r2} ${yb + LAYOUT.bridge}L${l2} ${yb + LAYOUT.bridge}C${l2} ${yb + m} ${l1} ${yb + m} ${l1} ${yb}Z`
}

export const worstDropIndex = (stages: FunnelStage[]) => {
  let worst = 0
  for (let i = 0; i < stages.length - 1; i++) {
    const d = dropPct(stages[i].value, stages[i + 1].value)
    if (d > dropPct(stages[worst].value, stages[worst + 1].value)) worst = i
  }
  return worst
}

/** Next stage index for arrow keys, or null when the key is not one. */
export const nextStage = (key: string, active: number | null, count: number) => {
  const keys: Record<string, number> = {
    ArrowDown: (active ?? -1) + 1,
    ArrowRight: (active ?? -1) + 1,
    ArrowUp: (active ?? count) - 1,
    ArrowLeft: (active ?? count) - 1,
    Home: 0,
    End: count - 1,
  }
  if (!(key in keys)) return null
  return clamp(keys[key], 0, count - 1)
}
