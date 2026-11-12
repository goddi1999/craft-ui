import { DAY, END_DATE, PAD, SAMPLES } from './interactive-area-chart.constants'
import type { AreaChartData, ChartPoint, ChartSeries } from './interactive-area-chart.types'

type Point = [x: number, y: number]

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

// two decimals keeps the path strings short
const round = (value: number) => Math.round(value * 100) / 100

/* demo data */

// mulberry32, so the demo data is the same on every load
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A seeded random walk of `count` daily points, ending on 13 Oct 2026. */
export function makeSeries(
  count: number,
  seed: number,
  start: number,
  drift: number,
  volatility: number,
): ChartPoint[] {
  const next = random(seed)
  let value = start
  return Array.from({ length: count }, (_, i) => {
    value += drift + (next() - 0.5) * volatility + Math.sin(i / (count / 6)) * volatility * 0.15
    value = Math.max(value, start * 0.4)
    return { date: END_DATE - (count - 1 - i) * DAY, value: Math.round(value) }
  })
}

export const DEFAULT_AREA_CHART_DATA: AreaChartData = {
  '7D': makeSeries(7, 11, 11800, 180, 900),
  '30D': makeSeries(30, 7, 9200, 95, 1100),
  '1Y': makeSeries(365, 3, 4200, 28, 700),
}

/* scale */

// catmull-rom, so a 7 point series still resamples into a smooth curve
function spline(values: number[], position: number) {
  const n = values.length
  if (n === 1) return values[0]
  const i = Math.min(Math.floor(position), n - 2)
  const t = position - i
  const p0 = values[Math.max(i - 1, 0)]
  const p1 = values[i]
  const p2 = values[i + 1]
  const p3 = values[Math.min(i + 2, n - 1)]
  return (
    p1 +
    0.5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0)))
  )
}

/** Round axis bounds and evenly spaced ticks around a range of values. */
export function niceScale(min: number, max: number, count = 4) {
  // a flat series has no spread, so size the steps off the value itself
  const spread = max - min || Math.abs(max) || 1
  const raw = spread / (count - 1)
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const n = raw / magnitude
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * magnitude
  const low = Math.floor(min / step) * step
  // and never let the axis collapse to a single value
  const high = Math.max(Math.ceil(max / step) * step, low + step)
  const ticks: number[] = []
  for (let v = low; v <= high + step / 2; v += step) ticks.push(v)
  return { low, high, ticks }
}

/** Works out each series' axis and resamples its values to `SAMPLES` points from 0 to 1. */
export function toSeries(data: AreaChartData) {
  const out: Record<string, ChartSeries> = {}
  for (const [key, points] of Object.entries(data)) {
    if (!points.length) continue
    const values = points.map((p) => p.value)
    const { low, high, ticks } = niceScale(Math.min(...values), Math.max(...values))
    const normalized = new Float64Array(SAMPLES)
    for (let k = 0; k < SAMPLES; k++) {
      const value = spline(values, (k / (SAMPLES - 1)) * (values.length - 1))
      normalized[k] = (value - low) / (high - low)
    }
    out[key] = { points, normalized, low, high, ticks }
  }
  return out
}

/* morph */

/** The curve `progress` of the way from one series to another. */
export function blend(from: Float64Array, to: Float64Array, progress: number) {
  const out = new Float64Array(SAMPLES)
  for (let k = 0; k < SAMPLES; k++) out[k] = from[k] + (to[k] - from[k]) * progress
  return out
}

export function sameSeries(a: Float64Array, b: Float64Array) {
  if (a === b) return true
  for (let k = 0; k < SAMPLES; k++) if (a[k] !== b[k]) return false
  return true
}

/* geometry */

export const plotWidth = (width: number) => Math.max(1, width - PAD.left - PAD.right)

export const plotBottom = (height: number) => height - PAD.bottom

/** Pixel height of a 0 to 1 value. */
export const toY = (n: number, height: number) =>
  PAD.top + (1 - n) * (height - PAD.top - PAD.bottom)

/** Pixel x of the point at `index` out of `length`; a lone point sits in the middle. */
export const indexToX = (index: number, length: number, width: number) =>
  PAD.left + (length > 1 ? index / (length - 1) : 0.5) * plotWidth(width)

/** Pixel height of the curve at `fraction` of the way across, between samples. */
export function curveY(samples: Float64Array, fraction: number, height: number) {
  const k = clamp(fraction, 0, 1) * (SAMPLES - 1)
  const i = Math.min(Math.floor(k), SAMPLES - 2)
  const a = samples[i]
  return toY(a + (samples[i + 1] - a) * (k - i), height)
}

function curvePoints(samples: Float64Array, width: number, height: number) {
  const plot = plotWidth(width)
  return Array.from(
    samples,
    (n, k): Point => [PAD.left + (k / (SAMPLES - 1)) * plot, toY(n, height)],
  )
}

// catmull-rom through the points, written as cubic béziers
function smoothPath(points: Point[]) {
  let d = `M${round(points[0][0])} ${round(points[0][1])}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1 = `${round(p1[0] + (p2[0] - p0[0]) / 6)} ${round(p1[1] + (p2[1] - p0[1]) / 6)}`
    const c2 = `${round(p2[0] - (p3[0] - p1[0]) / 6)} ${round(p2[1] - (p3[1] - p1[1]) / 6)}`
    d += `C${c1} ${c2} ${round(p2[0])} ${round(p2[1])}`
  }
  return d
}

export function linePath(samples: Float64Array, width: number, height: number) {
  return smoothPath(curvePoints(samples, width, height))
}

/** The line closed down to the bottom of the plot. */
export function areaPath(samples: Float64Array, width: number, height: number) {
  const points = curvePoints(samples, width, height)
  const bottom = plotBottom(height)
  const first = round(points[0][0])
  const last = round(points[points.length - 1][0])
  return `${smoothPath(points)}L${last} ${bottom}L${first} ${bottom}Z`
}

/** Indices for the date labels, evenly spaced, with the first and last always in. */
export function labelIndices(length: number, count: number) {
  const indices = Array.from({ length: count }, (_, j) =>
    Math.round((j / (count - 1)) * (length - 1)),
  )
  return [...new Set(indices)]
}

/* formatting */

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})
const fullDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})
const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' })
const numericDay = new Intl.DateTimeFormat('en-US', {
  month: 'numeric',
  day: 'numeric',
  timeZone: 'UTC',
})
const shortDay = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})
const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })

export const formatValue = (value: number) => currency.format(value)
export const formatTick = (value: number) => compactCurrency.format(value)
export const formatDate = (date: number) => fullDate.format(date)

/** Weekdays for a week, days for up to two months, months beyond that. */
export function formatAxisDate(date: number, length: number, narrow: boolean) {
  const format = length <= 10 ? weekday : narrow ? numericDay : length <= 60 ? shortDay : month
  return format.format(date)
}

/** Change from `from` to `to` as a fraction; 0 when there is nothing to compare to. */
export const percentChange = (from: number, to: number) => (from ? (to - from) / from : 0)
