// the source sets these three inline in prompt.js, there are no tokens for them
// field height following the text, no bounce
export const HEIGHT_SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 1 } as const
// status line opening above the text
export const STATUS_SPRING = { type: 'spring', stiffness: 380, damping: 30, mass: 1 } as const
// send arrow spinning away into the stop square, a touch of overshoot
export const MORPH_SPRING = { type: 'spring', stiffness: 520, damping: 30, mass: 1 } as const

// px. one 22px line, up to four, then the field scrolls
export const LINE_HEIGHT = 22
export const MAX_HEIGHT = 88
export const STATUS_HEIGHT = 30
// the morph may overshoot past 1, but not by more than this
export const MORPH_LIMIT = 1.2
export const ARROW_TURN = 90

// the prompt leaves the field a beat after it is sent
export const CLEAR_MS = 300
// a finished status stays this long before the line folds away
export const LINGER_MS = 1600

export const PULSE = { duration: 1, ease: 'easeInOut', repeat: Infinity } as const
export const SHINE = { duration: 1.4, ease: 'linear', repeat: Infinity } as const
// css `background .25s ease` on the dot
export const DOT_FADE = { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } as const

// green has no theme token, so the done dot stays fixed
export const DONE_DOT = 'bg-[#34d17a]'
export const SHIMMER_TEXT =
  'bg-[linear-gradient(90deg,var(--muted-foreground)_20%,var(--foreground)_50%,var(--muted-foreground)_80%)] bg-[length:200%_100%] bg-clip-text text-transparent'
