import { cancelFrame, frame } from 'motion/react'

import { SEGMENT_COLORS } from './usage-meter.constants'

import type { NumberPart, UsageStatus } from './usage-meter.types'

/** Starts an animation next frame, so its render never swallows the first frames. Returns a cleanup. */
export function soon(start: () => { stop: () => void }) {
  let controls: { stop: () => void } | null = null
  const run = () => {
    controls = start()
  }
  frame.update(run)
  return () => {
    cancelFrame(run)
    controls?.stop()
  }
}

const formats = new Map<number, Intl.NumberFormat>()

function formatterFor(decimals: number) {
  let format = formats.get(decimals)
  if (!format) {
    format = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    formats.set(decimals, format)
  }
  return format
}

/** Splits a number into columns keyed by place value, so 9.8 → 10.4 keeps the ones column and adds a tens. */
export function partsFor(value: number, decimals: number): NumberPart[] {
  const parts = formatterFor(decimals).formatToParts(value)
  let place = parts.reduce(
    (count, part) => count + (part.type === 'integer' ? part.value.length : 0),
    0,
  )
  let fraction = 0
  return parts.flatMap((part, index): NumberPart[] => {
    if (part.type === 'integer') {
      return [...part.value].map((char) => ({ key: `i${--place}`, digit: Number(char) }))
    }
    if (part.type === 'fraction') {
      return [...part.value].map((char) => ({ key: `f${fraction++}`, digit: Number(char) }))
    }
    const key =
      part.type === 'group' ? `g${place}` : part.type === 'decimal' ? 'd' : `${part.type}${index}`
    return [{ key, text: part.value }]
  })
}

export const roundTo = (value: number, decimals: number) =>
  Math.round(value * 10 ** decimals) / 10 ** decimals

export const formatAmount = (value: number, decimals: number, unit: string) =>
  `${value.toFixed(decimals)}${unit ? ` ${unit}` : ''}`

export function usageStatus(total: number, limit: number, warnAt: number): UsageStatus {
  if (total > limit) return 'over'
  return total >= limit * warnAt ? 'near' : 'ok'
}

/** The offset of a digit from the wheel position, wrapped into -5…5. */
export const wheelOffset = (digit: number, position: number) =>
  ((((digit - position) % 10) + 15) % 10) - 5

// past four, categories keep the lightest step rather than vanishing
export const segmentColor = (index: number) =>
  SEGMENT_COLORS[Math.min(index, SEGMENT_COLORS.length - 1)]
