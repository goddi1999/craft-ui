import { DemoPage } from '../demo-page'

import { Ridgeline } from './Ridgeline'
import type { RidgelineSeries } from './Ridgeline'

const SAMPLES = 160

/** Deterministic, roughly bell-shaped latency samples around `center`. */
function latencySamples(center: number, spread: number) {
  return Array.from({ length: SAMPLES }, (_, index) => {
    const wave = Math.sin(index * 12.9898) * 43758.5453
    const noise = wave - Math.floor(wave) - 0.5
    const tail = index % 17 === 0 ? spread * 2 : 0
    return Math.round(center + noise * spread * 2 + tail)
  })
}

const REGIONS: RidgelineSeries[] = [
  { id: 'us-east', label: 'US East', values: latencySamples(48, 14) },
  { id: 'us-west', label: 'US West', values: latencySamples(62, 18) },
  { id: 'eu-central', label: 'EU Central', values: latencySamples(85, 20) },
  { id: 'ap-south', label: 'Asia South', values: latencySamples(140, 34) },
  { id: 'sa-east', label: 'South America', values: latencySamples(118, 28) },
]

export function RidgelinePage() {
  return (
    <DemoPage
      eyebrow="shared / ridgeline"
      title="Ridgeline"
      description="Overlapping density curves, one per group, so distributions compare along a shared axis."
    >
      <div className="w-full max-w-3xl px-4">
        <Ridgeline series={REGIONS} label="API latency by region" unit=" ms" />
      </div>
    </DemoPage>
  )
}
