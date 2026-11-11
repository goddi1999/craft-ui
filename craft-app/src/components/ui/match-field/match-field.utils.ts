// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { CX, CY, DOT_STEP, INNER, PALETTE, R } from './match-field.constants'
import type { FieldRow, MatchItem, PlacedItem } from './match-field.types'

export const round = (n: number) => Math.round(n * 100) / 100
export const pct = (score: number) => `${Math.round(score * 100)}%`

/** Point at `turn` (0–1, clockwise from the top) and radius `r`. */
export const polar = (turn: number, r: number) => {
  const a = turn * 2 * Math.PI - Math.PI / 2
  // Rounded so server and client trig agree and hydration matches.
  return [round(CX + r * Math.cos(a)), round(CY + r * Math.sin(a))] as const
}

/** Integer hash in [0, 1): the same on every engine, unlike Math.random. */
function hash(a: number, b: number) {
  let h = Math.imul(a + 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x7f4a7c15, 0xc2b2ae35)
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d)
  h ^= h >>> 13
  return (h >>> 0) / 4294967296
}

/** Distance from the middle: a perfect score sits next to the icon. */
export function radiusOf(score: number, min: number) {
  const t = (1 - Math.min(Math.max(score, min), 1)) / Math.max(1 - min, 0.01)
  return INNER + 12 + t * (R - INNER - 16)
}

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

/** Spreads each sector's items across its width, best first, then goes round. */
export function placeItems(sectors: string[], items: MatchItem[], min: number): PlacedItem[] {
  const n = Math.max(sectors.length, 1)
  const out: (MatchItem & { turn: number; x: number; y: number })[] = []
  sectors.forEach((_, s) => {
    const group = items.filter((item) => item.sector === s).sort((a, b) => b.score - a.score)
    group.forEach((item, j) => {
      const f = group.length === 1 ? 0.5 : 0.26 + (0.48 * j) / (group.length - 1)
      const turn = (s + f - 0.5) / n
      const [x, y] = polar(turn, radiusOf(item.score, min))
      out.push({ ...item, turn, x, y })
    })
  })
  return out
    .sort((a, b) => ((a.turn + 1) % 1) - ((b.turn + 1) % 1))
    .map((item, i) => ({ ...item, color: item.color ?? PALETTE[i % PALETTE.length] }))
}

/**
 * The background field: rings of dots, one lobe per sector that reaches
 * further out where that sector has more items.
 */
export function buildField(sectors: string[], items: MatchItem[]): FieldRow[] {
  const n = Math.max(sectors.length, 1)
  const counts = sectors.map((_, s) => items.filter((i) => i.sector === s).length)
  const most = Math.max(1, ...counts)
  const rows: FieldRow[] = []
  for (let r = INNER + 10, ring = 0; r <= R - 3; r += DOT_STEP, ring++) {
    const count = Math.floor((2 * Math.PI * r) / DOT_STEP)
    const gap = 3 / ((2 * Math.PI * r) / n)
    const dots = []
    for (let k = 0; k < count; k++) {
      const turn = (k + (ring % 2) * 0.5) / count
      const pos = (((turn + 0.5 / n) % 1) + 1) % 1
      const s = Math.floor(pos * n) % n
      const f = pos * n - Math.floor(pos * n)
      if (f < gap || f > 1 - gap) continue
      const reach =
        (INNER + (R - INNER) * (0.5 + (0.42 * (counts[s] ?? 0)) / most)) *
        (0.84 + 0.16 * Math.sin(Math.PI * f))
      const noise = hash(ring, k)
      const on = r <= round(reach) && noise > 0.08
      const [x, y] = polar(turn, r)
      dots.push({ x, y, on, size: on ? round(1.6 + noise * 0.8) : 0.8 })
    }
    rows.push({ r, dots })
  }
  return rows
}

/** Index of the next item for a keyboard key, or null when the key is not one. */
export function nextIndex(key: string, at: number, count: number) {
  const keys: Record<string, number> = {
    ArrowRight: (at === -1 ? -1 : at) + 1,
    ArrowDown: (at === -1 ? -1 : at) + 1,
    ArrowLeft: (at === -1 ? count : at) - 1,
    ArrowUp: (at === -1 ? count : at) - 1,
    Home: 0,
    End: count - 1,
  }
  return key in keys ? (keys[key] + count) % count : null
}
