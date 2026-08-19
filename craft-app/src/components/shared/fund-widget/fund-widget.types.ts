export type FundTrend = 'up' | 'down'

export type FundItem = {
  id: string
  label: string
  /** Pre-formatted headline figure, e.g. `2.7Cr`. */
  value: string
  /** Pre-formatted delta, e.g. `12%`. */
  change: string
  trend?: FundTrend
}

export type FundWidgetProps = {
  data?: FundItem[]
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  className?: string
}
