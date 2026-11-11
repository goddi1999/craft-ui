// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
type ContextSegment = {
  id: string
  label: string
  tokens: number
  /** Secondary text under the label, such as "14 tools". */
  detail?: string
  /** Marks a segment that compaction never drops. */
  pinned?: boolean
  /** Any CSS color. Defaults to the built-in palette by position. */
  color?: string
}

type ContextWindowVariant = 'card' | 'inline'

type ContextWindowMeterProps = {
  data: { limit: number; segments: ContextSegment[]; model?: string }
  /** Share of the limit (0–1) where the warning zone starts. */
  warnAt?: number
  onCompact?: () => void
  compacting?: boolean
  /** `card` for a panel, `inline` for a single row in a composer footer. */
  variant?: ContextWindowVariant
  className?: string
}

/** A segment with its colour resolved. */
type ColoredSegment = ContextSegment & { color: string }

export type {
  ColoredSegment,
  ContextSegment,
  ContextWindowMeterProps,
  ContextWindowVariant,
}
