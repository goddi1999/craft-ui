// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
// Segment colors: blue, indigo, purple, teal, green, gray. Literal values so
// they read on both themes without needing a brand token.
export const PALETTE = [
  'oklch(0.62 0.19 255)',
  'oklch(0.58 0.2 280)',
  'oklch(0.63 0.21 315)',
  'oklch(0.75 0.12 200)',
  'oklch(0.7 0.17 150)',
  'oklch(0.62 0 0)',
]

/** Local colour tokens keep the folder portable: no theme setup needed. */
export const WARNING_TOKEN =
  '[--warning:oklch(0.56_0.14_65)] dark:[--warning:oklch(0.83_0.15_82)]'

export const formatTokens = (n: number) =>
  n < 1000 ? `${Math.round(n)}` : `${(n / 1000).toFixed(n < 100_000 ? 1 : 0)}k`

/** Splits the limit into `count` cells and colors each by the segment that fills it. */
export function fillCells(
  segments: { tokens: number; color: string }[],
  limit: number,
  count: number,
) {
  const cells: (string | null)[] = []
  for (const s of segments) {
    // Every non-empty segment gets at least one cell, so small ones stay visible.
    const n = s.tokens > 0 ? Math.max(1, Math.round((s.tokens / limit) * count)) : 0
    for (let i = 0; i < n && cells.length < count; i++) cells.push(s.color)
  }
  while (cells.length < count) cells.push(null)
  return cells
}
