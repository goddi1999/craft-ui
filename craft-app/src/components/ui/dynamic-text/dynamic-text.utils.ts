import {
  CYCLE_FIRST_STEP,
  CYCLE_LAST_HOLD,
  CYCLE_MIN_HOLD_MS,
  CYCLE_SPEEDUP,
  DIGITS,
  LOWER,
  UPPER,
} from './dynamic-text.constants'
import type { DynamicTextMode, DynamicTextWord } from './dynamic-text.types'

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null

/** Splits into user-perceived characters, so emoji and Hangul stay whole. */
export function splitGraphemes(value: string): string[] {
  return segmenter ? Array.from(segmenter.segment(value), (s) => s.segment) : Array.from(value)
}

export const isDigit = (char: string) => char >= '0' && char <= '9'
export const isBlank = (char: string) => char.trim() === ''
export const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export const toWord = (word: string | DynamicTextWord): DynamicTextWord =>
  typeof word === 'string' ? { text: word } : word

/** How long word `index` of `count` holds before the next one. */
export function holdFor(mode: DynamicTextMode, index: number, count: number, interval: number) {
  if (mode !== 'cycle' || index === 0) return interval
  if (index === count - 1) return interval * CYCLE_LAST_HOLD
  // the middle words speed up, like someone getting into the rhythm
  return Math.max(CYCLE_MIN_HOLD_MS, interval * CYCLE_FIRST_STEP * CYCLE_SPEEDUP ** (index - 1))
}

/** The scramble alphabet for a character: digits stay digits, case stays case. */
export function poolFor(char: string) {
  if (isDigit(char)) return DIGITS
  return char.toLowerCase() === char ? LOWER : UPPER
}

export const randomFrom = (pool: string) => pool[Math.floor(Math.random() * pool.length)]
