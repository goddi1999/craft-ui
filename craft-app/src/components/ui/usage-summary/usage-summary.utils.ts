// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { UsageDay } from './usage-summary.types'

export const STRIPES =
  'bg-[image:repeating-linear-gradient(-45deg,rgb(255_255_255/0.16)_0_3px,transparent_3px_7px)]'

// Series colors: blue, purple, cyan, yellow, green, gray. Literal values so
// they read on both themes without needing a brand token.
export const PALETTE = [
  'oklch(0.62 0.19 255)',
  'oklch(0.63 0.21 315)',
  'oklch(0.74 0.13 220)',
  'oklch(0.82 0.16 90)',
  'oklch(0.7 0.17 150)',
  'oklch(0.62 0 0)',
]

export const SPRING = { type: 'spring', duration: 0.5, bounce: 0 } as const

/** Strong ease-out for things that enter. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

export const formatTokens = (n: number) =>
  n < 1000
    ? `${Math.round(n)}`
    : n < 1_000_000
      ? `${(n / 1000).toFixed(n < 100_000 ? 1 : 0)}k`
      : `${(n / 1_000_000).toFixed(1)}M`

export const formatMoney = (n: number, currency: string) =>
  n.toLocaleString('en-US', { style: 'currency', currency, maximumFractionDigits: 2 })

export const dayLabel = (date: string, long = false) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    ...(long ? { weekday: 'short', month: 'short', day: 'numeric' } : { day: 'numeric' }),
  })

export const sum = (day: UsageDay, key: 'tokens' | 'cost') =>
  Object.values(day.byModel).reduce((n, m) => n + m[key], 0)
