// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
export const DAY = 86_400_000
export const PAD_X = 10
// A 38-minute rollback on a two-week axis still needs to be seen.
export const MIN_DIP = 12
export const REVEAL = 1.5
export const REVEAL_EASE = [0.3, 0.1, 0.2, 1] as const

// Motion tokens (TuffUI motion-tokens): strong ease-out in, faster out.
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const ENTER = { duration: 0.2, ease: EASE_OUT } as const
export const EXIT = { duration: 0.14, ease: EASE_OUT } as const

/** Settles the canary line gently when its score changes. */
export const CANARY_SPRING = { stiffness: 90, damping: 22 } as const

/** CSS version of EASE_OUT for class-based transitions. */
export const EASE_OUT_CLASS = 'ease-[cubic-bezier(0.23,1,0.32,1)]'

/**
 * Local colour tokens keep the folder portable: no theme setup needed. Brand
 * is the shadcn `primary`; positive and negative are tuned per theme.
 */
export const TONE_TOKENS =
  '[--negative:oklch(0.55_0.22_27)] [--positive:oklch(0.55_0.15_150)] dark:[--negative:oklch(0.72_0.18_25)] dark:[--positive:oklch(0.78_0.17_150)]'
