import type { ComponentProps } from 'react'

/** One point of a series. `date` is in UTC milliseconds. */
export type ChartPoint = { date: number; value: number }

/** Series keyed by the label on their range tab, e.g. `7D`, `30D`, `1Y`. */
export type AreaChartData = Record<string, ChartPoint[]>

export type InteractiveAreaChartProps = Omit<ComponentProps<'div'>, 'children' | 'title'> & {
  /**
   * Series keyed by range label, oldest point first. Empty series are skipped.
   * @default DEFAULT_AREA_CHART_DATA
   */
  data?: AreaChartData
  /** Range shown first. Falls back to the first key when it is missing. @default '30D' */
  defaultRange?: string
  /** Label above the value; also names the chart for screen readers. @default 'Revenue' */
  title?: string
  /** Height of the plot in px, header not included. @default 280 */
  height?: number
}

/** A series with its axis worked out and its values resampled for morphing. */
export type ChartSeries = {
  points: ChartPoint[]
  /** `SAMPLES` values from 0 (bottom of the axis) to 1 (top). */
  normalized: Float64Array
  low: number
  high: number
  ticks: number[]
}
