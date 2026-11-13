type FunnelStage = {
  label: string
  value: number
  /** Any CSS color. Defaults to a mix along the stage palette. */
  color?: string
}

type FunnelChartProps = {
  stages: FunnelStage[]
  formatValue?: (n: number) => string
  /** Overall conversion + biggest drop-off line above the chart. */
  showSummary?: boolean
  animated?: boolean
  /** Called when a stage is hovered, pressed, or reached with the arrow keys. */
  onSelect?: (index: number | null) => void
  ariaLabel?: string
  className?: string
}

export type { FunnelChartProps, FunnelStage }
