// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
type BarTone = 'brand' | 'positive' | 'negative' | 'warning' | 'neutral'

type BarSize = 'sm' | 'md' | 'lg'

type ProgressBarProps = Omit<React.ComponentProps<'div'>, 'role'> & {
  value: number
  max?: number
  tone?: BarTone
  /** Any CSS color for the fill; overrides `tone`, e.g. a per-series chart color. */
  color?: string
  size?: BarSize
  /** Diagonal stripes on the fill. */
  striped?: boolean
  /** `progress` for work toward done, `meter` for a level like quota or budget. */
  kind?: 'progress' | 'meter'
  /** Accessible name. */
  label: string
  /** Spoken value, e.g. "3,280 of 4,000 requests left". Defaults to a percentage. */
  valueText?: string
}

export type { BarSize, BarTone, ProgressBarProps }
