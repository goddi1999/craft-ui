import type { Transition } from 'motion/react'

import type { RollingCounterGrouping } from './rolling-counter.types'

const BOUNCE = 0.18
export const INSTANT = { duration: 0 } as const

export const spring = (duration: number): Transition => ({
  type: 'spring',
  visualDuration: duration,
  bounce: BOUNCE,
})

const MAX_DECIMALS = 15
const MAX_PAD = 24
const MIN_DURATION = 0.01
const MAX_DURATION = 60

const EVERY_THREE = /\B(?=(\d{3})+(?!\d))/g
const EVERY_TWO = /\B(?=(\d{2})+(?!\d))/g

export const mod = (n: number, m: number) => ((n % m) + m) % m

const clamp = (n: number, low: number, high: number) =>
  Math.min(high, Math.max(low, Number.isFinite(n) ? n : low))

const isDigit = (char: string) => char >= '0' && char <= '9'

function group(whole: string, separator: string, grouping: RollingCounterGrouping) {
  if (!separator) return whole
  if (grouping !== 'indian') return whole.replace(EVERY_THREE, separator)
  // indian: three at the end, pairs the rest of the way up
  const head = whole.slice(0, -3)
  if (!head) return whole
  return `${head.replace(EVERY_TWO, separator)}${separator}${whole.slice(-3)}`
}

export type CounterShape = {
  amount: number
  scaled: number
  places: number
  pace: number
  width: number
}

export function measure(
  value: number,
  decimals: number,
  padStart: number,
  duration: number,
): CounterShape {
  // NaN would make the previous-value comparison true forever
  const amount = Number.isFinite(value) ? value : 0
  const places = clamp(Math.trunc(decimals), 0, MAX_DECIMALS)
  const pad = clamp(Math.trunc(padStart), 1, MAX_PAD)
  // past MAX_SAFE_INTEGER the digits are noise, and past 1e21 String() goes exponential
  const scaled = Math.min(
    Number.MAX_SAFE_INTEGER,
    Math.round(Math.abs(amount) * 10 ** places),
  )
  return {
    amount,
    scaled,
    places,
    pace: clamp(duration, MIN_DURATION, MAX_DURATION),
    width: Math.max(String(scaled).length, places + pad),
  }
}

export function format(
  { scaled, places, width }: CounterShape,
  separator: string,
  decimalSeparator: string,
  grouping: RollingCounterGrouping,
) {
  const raw = String(scaled).padStart(width, '0')
  const whole = group(raw.slice(0, raw.length - places) || '0', separator, grouping)
  return places ? `${whole}${decimalSeparator}${raw.slice(raw.length - places)}` : whole
}

/** Keyed by distance from the right, so gaining a place moves columns instead of remounting them. */
export type CounterCell =
  | { kind: 'digit'; key: number; digit: number }
  | { kind: 'mark'; key: string; char: string }

export function toCells(chars: string, width: number): CounterCell[] {
  const cells: CounterCell[] = []
  let seen = 0
  // only digits advance the place, so a multi-character separator needs its own run index
  let run = 0
  for (const char of chars) {
    if (isDigit(char)) {
      run = 0
      cells.push({ kind: 'digit', key: width - seen++, digit: Number(char) })
    } else {
      cells.push({ kind: 'mark', key: `mark-${width - seen}-${run++}`, char })
    }
  }
  return cells
}
