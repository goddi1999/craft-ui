// Adapted from Kokonut UI's Typewriter (https://kokonutui.com) · MIT License
import type { TypewriterSequence } from './typewriter.types'

export const DEFAULT_SEQUENCES: readonly TypewriterSequence[] = [
  { text: 'Typewriter', deleteAfter: true },
  { text: 'Multiple Words', deleteAfter: true },
  { text: 'Auto Loop', deleteAfter: false },
]

// default rhythm, all in ms
export const TYPING_SPEED_MS = 50
export const DELETE_SPEED_MS = 30
export const START_DELAY_MS = 200
export const LOOP_DELAY_MS = 1000
export const PAUSE_BEFORE_DELETE_MS = 1000
export const NEXT_SEQUENCE_DELAY_MS = 100

// the caret stays solid while keys are being hit and only starts blinking
// once typing has stopped for this long, like a text editor; the blink
// itself (1s linear, solid a third, fade, hidden) is in typewriter.css
export const CARET_IDLE_MS = 500

// a wrong key gets noticed after this pause, then backspaced and retyped
export const TYPO_NOTICE_MS = 250
export const DEFAULT_TYPO_RATE = 0.04

// select-to-delete: the highlight sweeps the phrase in this long, holds a
// moment, then the text is cut
export const SELECT_SWEEP_MS = 120
export const SELECT_HOLD_MS = 220

// natural variance: 10% chance of a hesitation (2x), 10% of a burst (0.5x),
// otherwise +/- 40%
export const HESITATE_CHANCE = 0.1
export const HESITATE_FACTOR = 2
export const BURST_FACTOR = 0.5
export const VARIANCE = 0.4

// the text fades in once on mount
export const APPEAR = { duration: 0.5 } as const

export const SEED = 7

export const KEY_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'] as const
