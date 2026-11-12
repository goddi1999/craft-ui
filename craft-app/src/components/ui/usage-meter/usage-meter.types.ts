export type UsageMeterSegment = {
  /** Stable identity. Keep it while the value changes, so the segment re-flows in place. */
  id: string
  label: string
  value: number
}

/**
 * A segmented bar for a fixed allowance, such as storage, seats or API calls: what takes the
 * space, how close the total is to the limit, and a status badge that warns near and past it.
 */
export type UsageMeterProps = {
  /** What is measured, such as "Workspace storage". */
  label: string
  /** Used amounts in display order. Up to four read clearly. */
  segments: UsageMeterSegment[]
  /** The plan limit, in the same unit as the segments. */
  limit: number
  /** Unit after every number, such as "GB". @default '' */
  unit?: string
  /** Digits after the decimal point. @default 1 */
  decimals?: number
  /** Legend label for the space left. @default 'Free' */
  freeLabel?: string
  /** Legend label for the overage. @default 'Over limit' */
  overLabel?: string
  /** Share of the limit at which the badge warns that it is almost full. @default 0.9 */
  warnAt?: number
  className?: string
}

export type UsageStatus = 'ok' | 'near' | 'over'

/** On while its category is hovered, focused or pinned; off while another one is. */
export type Highlight = 'on' | 'off' | undefined

/** A number split into columns keyed by place value. */
export type NumberPart = { key: string; digit: number } | { key: string; text: string }

export type LegendItem = { id: string; label: string; value: number }
