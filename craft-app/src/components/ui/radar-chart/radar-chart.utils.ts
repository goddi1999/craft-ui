// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { GAP, LINE, MAX_R, MIN_R, PAD, WRAP } from './radar-chart.constants'

export const round = (n: number) => Math.round(n * 100) / 100

// Rough text widths at 12px, so labels can be fitted before they render.
const sansW = (s: string) => s.length * 6.3
const monoW = (s: string) => s.length * 7.3

/** Unit direction of each axis, clockwise from the top. */
export const axisAngles = (count: number) =>
  Array.from({ length: count }, (_, i) => {
    const a = (i / Math.max(count, 1)) * 2 * Math.PI
    return { dx: Math.sin(a), dy: -Math.cos(a) }
  })

/** Narrow cards wrap names by word and put the value on its own line. */
export const wrapLabels = (axes: string[]) =>
  axes.map((label) =>
    label.split(' ').reduce<string[]>((acc, word) => {
      const last = acc[acc.length - 1]
      if (last && sansW(`${last} ${word}`) <= WRAP) acc[acc.length - 1] = `${last} ${word}`
      else acc.push(word)
      return acc
    }, []),
  )

type Angle = { dx: number; dy: number }

/** Fits the radius so every label stays inside the card, and sizes the SVG. */
export function layoutRadar(
  axes: string[],
  values: string[],
  angles: Angle[],
  width: number,
) {
  const wrapped = wrapLabels(axes)
  const fit = (stacked: boolean) =>
    Math.min(
      MAX_R,
      ...angles.map(({ dx }, i) => {
        const w = stacked
          ? Math.max(...wrapped[i].map(sansW), monoW(values[i]))
          : sansW(axes[i]) + 4 + monoW(values[i])
        if (Math.abs(dx) < 0.15) return (width / 2 - PAD) * 2 >= w ? MAX_R : MIN_R
        return (width / 2 - w - PAD) / Math.abs(dx) - GAP
      }),
    )
  const stacked = fit(false) < 96 && fit(true) > fit(false)
  const R = Math.max(MIN_R, Math.floor(fit(stacked)))
  const lines = axes.map((_, i) => (stacked ? wrapped[i].length + 1 : 1))

  // Vertical room each label needs past the polygon, above and below.
  const reach = (side: 1 | -1) =>
    Math.max(
      R,
      ...angles.map(({ dx, dy }, i) => {
        const d = (R + GAP) * dy * side
        return Math.abs(dx) < 0.15
          ? d + (d > 0 ? lines[i] * LINE : 0)
          : d + (lines[i] * LINE) / 2
      }),
    )
  const top = reach(-1) + PAD
  const height = Math.ceil(top + reach(1) + PAD)
  return { R, stacked, lines, wrapped, height, cx: round(width / 2), cy: round(top) }
}

/** Index of the next axis for a keyboard key, or null when the key is not one. */
export function nextAxis(key: string, active: number | null, count: number) {
  const keys: Record<string, number> = {
    ArrowRight: (active ?? -1) + 1,
    ArrowDown: (active ?? -1) + 1,
    ArrowLeft: (active ?? count) - 1,
    ArrowUp: (active ?? count) - 1,
    Home: 0,
    End: count - 1,
  }
  return key in keys ? (keys[key] + count) % count : null
}
