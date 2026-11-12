import type { UnlockStatus } from './unlock-face-id.types'

export const DEFAULT_SIZE = 128
export const DEFAULT_SCAN_DURATION = 1800

export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_IN_OUT = [0.645, 0.045, 0.355, 1] as const
export const INSTANT = { duration: 0 } as const
// the check lands with a small bounce
export const CHECK_SPRING = { type: 'spring', bounce: 0.28, duration: 0.4 } as const
// the face glyph pops in and shrinks away, barely any bounce
export const GLYPH_SPRING = { type: 'spring', bounce: 0.1, duration: 0.25 } as const

// seconds: corners draw first, then the face strokes, each one a beat after the last
export const BRACKET_DRAW = 0.4
export const BRACKET_STAGGER = 0.07
export const FACE_DELAY = 0.26
export const FACE_DRAW = 0.42
export const FACE_STAGGER = 0.07
export const SCAN_SWEEP = 1.5
export const SHAKE_DURATION = 0.4
export const CONTENT_REVEAL = 0.4
export const SHAKE_KEYFRAMES = [0, -7, 7, -5, 5, -2, 0]

// apple's face id mark in a 100 x 100 box: four corner brackets and a schematic face
export const VIEWBOX = 100
export const STROKE_WIDTH = 4
export const CHECK_STROKE_WIDTH = 5

// corners only, no full outline, with a clear gap between them
export const BRACKET_PATHS = [
  'M8 34 L8 28 A20 20 0 0 1 28 8 L34 8',
  'M66 8 L72 8 A20 20 0 0 1 92 28 L92 34',
  'M92 66 L92 72 A20 20 0 0 1 72 92 L66 92',
  'M34 92 L28 92 A20 20 0 0 1 8 72 L8 66',
]

// two short eye strokes, a nose that turns right at the bottom, and a
// shallow smile with small upward ticks at each end
export const FACE_PATHS = [
  'M36 38 L36 47',
  'M64 38 L64 47',
  'M50 38 L50 54 Q50 57.5 53.5 57.5 L56 57.5',
  'M36 61 L36 66 Q50 73 64 66 L64 61',
]

export const CHECK_PATH = 'M30 52 L44 66 L72 34'

export const SCAN_CLIP = { height: 84, rx: 22, width: 84, x: 8, y: 8 }
export const SCAN_BAND_HEIGHT = 18
export const SCAN_TRAVEL = 34

export const STATUS_MESSAGES: Record<Exclude<UnlockStatus, 'error'>, string> = {
  idle: 'Ready to scan.',
  scanning: 'Scanning face…',
  success: 'Identity confirmed. Unlocked.',
}

// the theme has no success token, so green is a fixed status colour with a dark variant
export const SUCCESS_TEXT = 'text-green-600 dark:text-green-500'

export const TONE: Record<UnlockStatus, string> = {
  idle: 'text-foreground',
  scanning: 'text-foreground',
  success: SUCCESS_TEXT,
  error: 'text-destructive',
}

export const MESSAGE_TONE: Record<UnlockStatus, string> = {
  idle: 'text-muted-foreground',
  scanning: 'text-muted-foreground',
  success: SUCCESS_TEXT,
  error: 'text-destructive',
}
