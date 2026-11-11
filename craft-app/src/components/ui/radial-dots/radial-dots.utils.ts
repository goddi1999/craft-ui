// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { C, INNER, LANES, RINGS } from './radial-dots.constants'
import type { ColoredRadialSeries } from './radial-dots.types'

export const round = (n: number) => Math.round(n * 100) / 100

/** Point at `turn` (0–1, clockwise from the top) and radius `r`. */
export const polar = (turn: number, r: number) => {
  const a = turn * 2 * Math.PI - Math.PI / 2
  // Rounded so server and client trig agree and hydration matches.
  return [round(C + r * Math.cos(a)), round(C + r * Math.sin(a))] as const
}

/** Outline of one sector's slice, used as an invisible hover target. */
export function wedgePath(i: number, n: number) {
  const [x1, y1] = polar(i / n, INNER)
  const [x2, y2] = polar(i / n, C)
  const [x3, y3] = polar((i + 1) / n, C)
  const [x4, y4] = polar((i + 1) / n, INNER)
  return `M${x1} ${y1}L${x2} ${y2}A${C} ${C} 0 0 1 ${x3} ${y3}L${x4} ${y4}A${INNER} ${INNER} 0 0 0 ${x1} ${y1}Z`
}

/** Fills lanes ring by ring, inner series first. Null slots are empty. */
export function fillSlots(
  series: ColoredRadialSeries[],
  index: number,
  per: number,
): (string | null)[] {
  const slots: (string | null)[] = Array(RINGS * LANES).fill(null)
  let at = 0
  for (const s of series) {
    const dots = Math.round((s.values[index] ?? 0) / per)
    for (let k = 0; k < dots && at < slots.length; k++) slots[at++] = s.color
  }
  return slots
}

/** Index of the next sector for a keyboard key, or null when the key is not one. */
export function nextSector(key: string, active: number | null, count: number) {
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
