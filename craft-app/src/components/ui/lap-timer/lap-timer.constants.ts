// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
export const MAX_DIAL = 288

/** Seconds per turn the dial can pick from, smallest first. */
export const DIALS = [10, 15, 20, 30, 60, 90, 120, 180, 300, 600, 900, 1800, 3600]

// Motion tokens (TuffUI motion-tokens).
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const ENTER = { duration: 0.2, ease: EASE_OUT } as const

/** CSS version of EASE_OUT for class-based transitions. */
export const EASE_OUT_CLASS = 'ease-[cubic-bezier(0.23,1,0.32,1)]'

/**
 * Local colour token keeps the folder portable: no theme setup needed. The
 * accent is the shadcn `primary`; positive is tuned per theme.
 */
export const TONE_TOKENS =
  '[--positive:oklch(0.55_0.15_150)] dark:[--positive:oklch(0.78_0.17_150)]'
