import { DemoPage } from '../demo-page'

import { Streamgraph } from './Streamgraph'
import type { StreamgraphDatum, StreamgraphSeries } from './Streamgraph'

const WEEKS = 26
const START = Date.UTC(2026, 0, 5)
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

const dayFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})
const monthFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  timeZone: 'UTC',
})

const SERIES: StreamgraphSeries[] = [
  { key: 'bugs', label: 'Bugs' },
  { key: 'billing', label: 'Billing' },
  { key: 'onboarding', label: 'Onboarding' },
  { key: 'integrations', label: 'Integrations' },
]

// Deterministic waves stand in for real ticket volume.
const TICKETS: StreamgraphDatum[] = Array.from({ length: WEEKS }, (_, week) => {
  const date = new Date(START + week * WEEK_MS)
  const isMonthStart = date.getUTCDate() <= 7
  return {
    key: date.toISOString().slice(0, 10),
    label: `Week of ${dayFormat.format(date)}`,
    axisLabel: isMonthStart ? monthFormat.format(date) : undefined,
    values: {
      bugs: Math.round(60 + Math.sin(week / 3) * 22),
      billing: Math.round(40 + Math.cos(week / 4) * 14 + week),
      onboarding: Math.round(30 + Math.sin(week / 5 + 1) * 18),
      integrations: Math.round(20 + Math.max(0, week - 10) * 2.5),
    },
  }
})

export function StreamgraphPage() {
  return (
    <DemoPage
      eyebrow="shared / streamgraph"
      title="Streamgraph"
      description="Stacked series flowing around a center line, so the overall volume and each topic's share read at a glance."
    >
      <div className="w-full max-w-3xl px-4">
        <Streamgraph
          data={TICKETS}
          series={SERIES}
          label="Support tickets by topic"
          unit="tickets"
          categoryLabel="Week"
        />
      </div>
    </DemoPage>
  )
}
