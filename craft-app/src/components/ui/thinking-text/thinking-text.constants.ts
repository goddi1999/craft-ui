// Adapted from Kokonut UI's AI Text Loading (https://kokonutui.com) · MIT License
import type { Variants } from 'motion/react'

export const DEFAULT_TEXTS = [
  'Thinking...',
  'Processing...',
  'Analyzing...',
  'Computing...',
  'Almost...',
] as const

// how long each word stays before the next one
export const INTERVAL_MS = 1500
// the elapsed timer reads the clock twice a second so it never skips a number
export const ELAPSED_TICK_MS = 500

// strong ease-out: quick start, long soft landing
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

// delay between neighbouring letters in the wave, in seconds; the wave itself
// (1.6s, ease-in-out, dips to 0.3 opacity) is in thinking-text.css
export const WAVE_STEP = 0.07
export const LETTER_STAGGER = 0.018

export const WORD_VARIANTS = {
  enter: {},
  shown: { transition: { staggerChildren: LETTER_STAGGER } },
  exit: {
    opacity: 0,
    y: -6,
    filter: 'blur(3px)',
    transition: { duration: 0.15, ease: EASE_OUT },
  },
} satisfies Variants

export const LETTER_VARIANTS = {
  enter: { opacity: 0, y: 8, filter: 'blur(4px)' },
  shown: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.28, ease: EASE_OUT },
  },
} satisfies Variants
