import { DemoPage } from '../demo-page'

import { LineChart } from './LineChart'
import type { LineChartDatum, LineChartSeries } from './LineChart'

const DAYS = 30
const AXIS_EVERY = 5
const START = Date.UTC(2026, 8, 1)
const DAY_MS = 24 * 60 * 60 * 1000

const fullDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})
const shortDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

// Deterministic waves stand in for real traffic so the demo renders the same every time.
const SIGNUPS: LineChartDatum[] = Array.from({ length: DAYS }, (_, day) => {
  const date = new Date(START + day * DAY_MS)
  return {
    key: date.toISOString().slice(0, 10),
    label: fullDate.format(date),
    axisLabel: day % AXIS_EVERY === 0 ? shortDate.format(date) : undefined,
    values: {
      signups: Math.round(120 + day * 2.4 + Math.sin(day / 2) * 18),
      previous: Math.round(100 + day * 1.2 + Math.cos(day / 3) * 12),
    },
  }
})

const SERIES: LineChartSeries[] = [
  { key: 'signups', label: 'This period' },
  { key: 'previous', label: 'Previous period', dashed: true },
]

export function LineChartPage() {
  return (
    <DemoPage
      eyebrow="shared / line-chart"
      title="Line chart"
      description="Trends over time with a scrubbing crosshair, a dashed comparison series, and a legend that hides series."
    >
      <div className="w-full max-w-3xl px-4">
        <LineChart label="Signups" data={SIGNUPS} series={SERIES} />
      </div>
    </DemoPage>
  )
}
