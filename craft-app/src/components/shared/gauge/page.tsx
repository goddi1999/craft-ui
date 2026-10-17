import { DemoPage } from '../demo-page'

import { Gauge } from './Gauge'
import type { GaugeThreshold } from './Gauge'

const DISK_THRESHOLDS: GaugeThreshold[] = [
  { from: 0, tone: 'success', label: 'Healthy' },
  { from: 70, tone: 'warning', label: 'Filling up' },
  { from: 90, tone: 'danger', label: 'Critical' },
]

export function GaugePage() {
  return (
    <DemoPage
      eyebrow="shared / gauge"
      title="Gauge"
      description="A radial meter whose arc sweeps to the value, with threshold bands that name the state so it never rests on color alone."
    >
      <div className="flex w-full max-w-2xl justify-center px-4">
        <Gauge
          label="Disk usage"
          value={72}
          detail="360 of 500 GB"
          thresholds={DISK_THRESHOLDS}
        />
      </div>
    </DemoPage>
  )
}
