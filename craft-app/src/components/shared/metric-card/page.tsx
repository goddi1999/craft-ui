import { DemoPage } from '../demo-page'

import { MetricCard } from './MetricCard'

export function MetricCardPage() {
  return (
    <DemoPage
      eyebrow="shared / metric-card"
      title="Metric card"
      description="A KPI tile with an animated figure, its context, and the change since the last period."
    >
      <div className="grid gap-4 px-4 sm:grid-cols-3">
        <MetricCard
          label="Uptime"
          value={99.9}
          suffix="%"
          context="Last 30 days"
          change="+0.2%"
        />
        <MetricCard
          label="Active users"
          value={18_420}
          context="This week"
          change="+12%"
        />
        <MetricCard
          label="Error rate"
          value={0.4}
          suffix="%"
          context="Last 24 hours"
          change="-0.1%"
        />
      </div>
    </DemoPage>
  )
}
