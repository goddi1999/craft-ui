import { DemoPage } from '../demo-page'

import { Sparkline } from './Sparkline'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function SparklinePage() {
  return (
    <DemoPage
      eyebrow="shared / sparkline"
      title="Sparkline"
      description="A compact trend line with a headline value and change. Hover or use the arrow keys to scrub each point."
    >
      <div className="flex flex-wrap justify-center gap-8 px-4">
        <Sparkline
          label="Signups"
          data={[12, 18, 15, 22, 30, 27, 34]}
          labels={WEEKDAYS}
          value="34"
          change="+26%"
          tone="success"
        />
        <Sparkline
          label="Churn"
          data={[9, 8, 10, 7, 11, 12, 14]}
          labels={WEEKDAYS}
          value="14"
          change="+55%"
          tone="danger"
        />
      </div>
    </DemoPage>
  )
}
