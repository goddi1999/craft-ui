// Adapted from Kokonut UI's Dynamic Text (https://kokonutui.com) · MIT License
import type { DynamicTextMode, DynamicTextWord } from './dynamic-text.types'

export const DEFAULT_WORDS: Record<DynamicTextMode, readonly (string | DynamicTextWord)[]> = {
  morph: ['Create', 'Iterate', 'Repeat', 'Ship'],
  decode: ['Hello, world', 'Build 4096 ready', 'All systems go'],
  cycle: [
    { text: 'Hello', lang: 'en' },
    { text: 'こんにちは', lang: 'ja' },
    { text: 'Bonjour', lang: 'fr' },
    { text: 'Hola', lang: 'es' },
    { text: '안녕하세요', lang: 'ko' },
    { text: 'Ciao', lang: 'it' },
    { text: 'Hallo', lang: 'de' },
    { text: 'Hello', lang: 'en' },
  ],
}

export const DEFAULT_INTERVAL: Record<DynamicTextMode, number> = {
  morph: 2200,
  decode: 2800,
  cycle: 900,
}

// cycle rhythm: the last word holds twice as long, the middle ones start at
// 0.36 of the interval and get 0.8x shorter each, never under 90ms
export const CYCLE_LAST_HOLD = 2
export const CYCLE_FIRST_STEP = 0.36
export const CYCLE_SPEEDUP = 0.8
export const CYCLE_MIN_HOLD_MS = 90

/** A mass-1 spring from its stiffness and damping ratio (1 is critical, below overshoots). */
const spring = (stiffness: number, ratio: number) =>
  ({ stiffness, damping: 2 * ratio * Math.sqrt(stiffness) }) as const

// TRAVEL_K/C 140 at 0.8: shared letters gliding to their new place, a hair of overshoot
export const TRAVEL_SPRING = spring(140, 0.8)
// LIFT_K/C 300 at 0.9: the little hop that carries a travelling letter over its neighbours
export const LIFT_SPRING = spring(300, 0.9)
// ROLL_K/C 200 at 0.86: digits rolling in and out like a counter
export const ROLL_SPRING = spring(200, 0.86)
// SQUASH_K/C 1400 at 0.6: the quick squash and stretch when a dropped letter lands
export const SQUASH_SPRING = spring(1400, 0.6)
// TILT_K/C 140 at 0.7: a leaving letter tipping over as it falls
export const TILT_SPRING = spring(140, 0.7)
// WIDTH_K/C 220 at 1: the box resizing to the new word, no overshoot
export const WIDTH_SPRING = spring(220, 1)

// the physics ticks in fixed 1/120s steps and never jumps more than 50ms a frame
export const STEP = 1 / 120
export const MAX_FRAME = 0.05

// distances below are in em, so the motion scales with the font
export const GRAVITY = 32
export const DROP = 0.7
export const FALL_FADE = 0.9
export const ROLL = 0.75
// leaving digits roll a bit further than entering ones so they clear the line
export const ROLL_OUT = 1.2
export const LAND_SQUASH = -0.16
// travel arc: 14% of the distance, at most 0.22em
export const ARC = 0.14
export const MAX_ARC = 0.22
// a falling letter drifts sideways this fast and tips 5-15 degrees
export const FALL_DRIFT = 0.4
export const TILT_MIN = 5
export const TILT_SPREAD = 11
// opacity per second for plain fades (reduced motion and travel fade-in)
export const FADE_RATE = 7

export const ENTER_STAGGER = 0.035
/** Long strings share this much stagger, so the last letter is not late. */
export const MAX_ENTER_SPREAD = 0.45

// decode: cells scramble every 50ms, start locking at 150ms, flash the accent for 50ms
export const SWAP_EVERY = 0.05
export const FLASH_FOR = 0.05
export const LOCK_START = 0.15
// stagger between locks, squeezed so a long string still locks in 0.75s
export const LOCK_STAGGER = 0.05
export const LOCK_SPREAD = 0.75
// reduced motion: a plain fade instead of the scramble
export const DECODE_FADE = { duration: 160, easing: 'ease-out' } as const

export const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/'
export const LOWER = 'abcdefghijklmnopqrstuvwxyz#%&*+=<>/'
export const DIGITS = '0123456789'
