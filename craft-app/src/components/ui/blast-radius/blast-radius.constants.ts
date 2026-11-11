// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
export const SIZE = 320
export const C = SIZE / 2
export const OUTER = 132
export const CENTER_R = 22

// Share of a parent's sector its children fan across, so neighbouring fans never touch.
export const SPREAD = 0.72

export const PALETTE = [
  'var(--primary)',
  '#1a9e8c',
  '#bf5af2',
  '#b8862b',
  '#5e5ce6',
  '#30b0c7',
]

/** Strong ease-out for things that enter or leave. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

export const ENTER = { duration: 0.2, ease: EASE_OUT } as const

/** Exits run faster than entrances. */
export const EXIT = { duration: 0.14, ease: EASE_OUT } as const

/** Keyboard-initiated changes never wait. */
export const INSTANT = { duration: 0 } as const

// The affected colour as a variable on the root (same values as StatusPill's
// negative tone), so strokes and text read on both themes without a token.
export const NEGATIVE_TONE = '[--tone:oklch(0.55_0.22_27)] dark:[--tone:oklch(0.72_0.18_25)]'
