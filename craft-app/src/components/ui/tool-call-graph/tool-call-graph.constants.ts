// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { ToolCallMetric } from './tool-call-graph.types'

export const METRICS: { value: ToolCallMetric; label: string; noun: string }[] = [
  { value: 'calls', label: 'Calls', noun: 'call volume' },
  { value: 'latency', label: 'Latency', noun: 'p50 latency' },
  { value: 'errors', label: 'Errors', noun: 'error rate' },
]

/** Height of one tool row and the gap between rows, in px. */
export const ROW = 58
export const GAP = 8

// Motion tokens (TuffUI motion-tokens).
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const SPRING = { type: 'spring', duration: 0.3, bounce: 0 } as const

/** CSS version of EASE_OUT for class-based transitions. */
export const EASE_OUT_CLASS = 'ease-[cubic-bezier(0.23,1,0.32,1)]'

/**
 * Local colour token keeps the folder portable: no theme setup needed. The
 * accent is the shadcn `primary`; negative is tuned per theme.
 */
export const TONE_TOKENS =
  '[--negative:oklch(0.55_0.22_27)] dark:[--negative:oklch(0.72_0.18_25)]'
