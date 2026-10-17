import { DemoPage } from '../demo-page'

import { DonutChart } from './DonutChart'
import type { DonutChartDatum } from './DonutChart'

const TRAFFIC_SOURCES: DonutChartDatum[] = [
  { key: 'search', label: 'Search', value: 4210 },
  { key: 'direct', label: 'Direct', value: 2380 },
  { key: 'social', label: 'Social', value: 1190 },
  { key: 'email', label: 'Email', value: 640 },
  { key: 'ads', label: 'Ads', value: 120 },
  { key: 'other', label: 'Referral', value: 90 },
]

export function DonutChartPage() {
  return (
    <DemoPage
      eyebrow="shared / donut-chart"
      title="Donut chart"
      description="Parts of a whole as ring segments, with a live total, small slices grouped into Other, and a legend that toggles segments."
    >
      <div className="flex w-full max-w-2xl justify-center px-4">
        <DonutChart label="Visits by source" unit="visits" data={TRAFFIC_SOURCES} />
      </div>
    </DemoPage>
  )
}
