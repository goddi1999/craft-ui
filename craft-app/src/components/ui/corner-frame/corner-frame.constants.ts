export const CORNER_FRAME_DEFAULTS = {
  /** Arm length along each edge, in px. */
  length: 44,
  /** Stroke thickness of the bracket, in px. */
  width: 14,
  /** Bend radius of the corner, in px (match the parent’s `rounded-*`). */
  height: 32,
} as const

export const CORNER_FRAME_SIZES = {
  sm: { length: 28, width: 8, height: 16 },
  default: CORNER_FRAME_DEFAULTS,
  lg: { length: 64, width: 18, height: 48 },
} as const

export type CornerFrameSize = keyof typeof CORNER_FRAME_SIZES
