import { DemoPage } from '../demo-page'

import { SlopeChart } from './SlopeChart'
import type { SlopeItem } from './SlopeChart'

const CHANNELS: SlopeItem[] = [
  { key: 'email', label: 'Email', start: 3.1, end: 4.6 },
  { key: 'search', label: 'Organic search', start: 3.4, end: 3.6 },
  { key: 'referral', label: 'Referral', start: 2.6, end: 2.9 },
  { key: 'social', label: 'Paid social', start: 1.9, end: 1.3 },
]

const formatPercent = (value: number) => `${value.toFixed(1)}%`

export function SlopeChartPage() {
  return (
    <DemoPage
      eyebrow="shared / slope-chart"
      title="Slope chart"
      description="Before and after values joined by lines, so rises, falls, and rank changes between two periods stand out."
    >
      <div className="w-full max-w-xl px-4">
        <SlopeChart
          data={CHANNELS}
          label="Conversion by channel"
          startLabel="Q1"
          endLabel="Q2"
          highlightKey="email"
          formatValue={formatPercent}
        />
      </div>
    </DemoPage>
  )
}
